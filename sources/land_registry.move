module land_registry::land {
    use std::signer;
    use std::string;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;

    // Struct representing a User
    struct User has key, store {
        username: string::String,
        password: string::String,
        lands: vector<u64>,  // IDs of lands owned by this user
        lands_count: u64,
    }

    // Struct representing an Operator
    struct Operator has key, store {
        username: string::String,
        password: string::String,
        role: string::String,
        pending_approvals: vector<u64>,  // IDs of pending land transfers
    }

    // Struct representing a Land
    struct Land has key, store {
        id: u64,
        name: string::String,
        owner: address,
        area: u64,
        location: string::String,
        hash: string::String,
        is_approved: bool,
        transfer_request: TransferRequest,
    }

    // Struct representing a transfer request
    struct TransferRequest has store {
        from: address,
        to: address,
        status: u8,  // 0 = none, 1 = requested, 2 = approved by owner, 3 = approved by operator
    }

    // Events
    struct UserRegisteredEvent has drop, store {
        username: string::String,
        user_address: address,
    }

    struct LandRegisteredEvent has drop, store {
        land_id: u64,
        owner: address,
        name: string::String,
    }

    struct TransferRequestedEvent has drop, store {
        land_id: u64,
        from: address,
        to: address,
    }

    struct TransferApprovedEvent has drop, store {
        land_id: u64,
        new_owner: address,
    }

    // Errors
    const EUSER_EXISTS: u64 = 1;
    const EOPERATOR_EXISTS: u64 = 2;
    const EINVALID_CREDENTIALS: u64 = 3;
    const ELAND_LIMIT_REACHED: u64 = 4;
    const ENOT_LAND_OWNER: u64 = 5;
    const ETRANSFER_NOT_REQUESTED: u64 = 6;
    const ETRANSFER_ALREADY_APPROVED: u64 = 7;
    const EOPERATOR_NOT_AUTHORIZED: u64 = 8;

    // Initialize the module
    public entry fun initialize(account: &signer) {
        move_to(account, Operator {
            username: string::utf8(b"admin"),
            password: string::utf8(b"admin123"),
            role: string::utf8(b"admin"),
            pending_approvals: vector::empty(),
        });
    }

    // Register a new user
    public entry fun register_user(
        account: &signer,
        username: string::String,
        password: string::String,
    ) acquires User {
        let addr = signer::address_of(account);
        assert!(!exists<User>(addr), EUSER_EXISTS);

        move_to(account, User {
            username,
            password,
            lands: vector::empty(),
            lands_count: 0,
        });

        event::emit(UserRegisteredEvent {
            username,
            user_address: addr,
        });
    }

    // Register a new land for a user
    public entry fun register_land(
        user: &signer,
        name: string::String,
        area: u64,
        location: string::String,
    ) acquires User, Land {
        let user_addr = signer::address_of(user);
        assert!(exists<User>(user_addr), EINVALID_CREDENTIALS);

        let user_account = borrow_global_mut<User>(user_addr);
        assert!(user_account.lands_count < 10, ELAND_LIMIT_REACHED);

        let land_id = account::create_resource_address(&user_addr, user_account.lands_count);
        let land_hash = generate_land_hash(name, area, location);

        move_to(user, Land {
            id: land_id,
            name,
            owner: user_addr,
            area,
            location,
            hash: land_hash,
            is_approved: false,
            transfer_request: TransferRequest {
                from: user_addr,
                to: user_addr,
                status: 0,
            },
        });

        vector::push_back(&mut user_account.lands, land_id);
        user_account.lands_count = user_account.lands_count + 1;

        event::emit(LandRegisteredEvent {
            land_id,
            owner: user_addr,
            name,
        });
    }

    // Request land transfer
    public entry fun request_land_transfer(
        from: &signer,
        to_addr: address,
        land_id: u64,
    ) acquires Land, Operator {
        let from_addr = signer::address_of(from);
        assert!(exists<Land>(land_id), EINVALID_CREDENTIALS);

        let land = borrow_global_mut<Land>(land_id);
        assert!(land.owner == from_addr, ENOT_LAND_OWNER);
        assert!(land.transfer_request.status == 0, ETRANSFER_ALREADY_APPROVED);

        land.transfer_request = TransferRequest {
            from: from_addr,
            to: to_addr,
            status: 1,  // Requested
        };

        // Add to operator's pending approvals
        if (exists<Operator>(@land_registry)) {
            let operator = borrow_global_mut<Operator>(@land_registry);
            vector::push_back(&mut operator.pending_approvals, land_id);
        };

        event::emit(TransferRequestedEvent {
            land_id,
            from: from_addr,
            to: to_addr,
        });
    }

    // Approve land transfer (by owner)
    public entry fun approve_transfer_by_owner(
        user: &signer,
        land_id: u64,
    ) acquires Land {
        let user_addr = signer::address_of(user);
        assert!(exists<Land>(land_id), EINVALID_CREDENTIALS);

        let land = borrow_global_mut<Land>(land_id);
        assert!(land.owner == user_addr, ENOT_LAND_OWNER);
        assert!(land.transfer_request.status == 1, ETRANSFER_NOT_REQUESTED);

        land.transfer_request.status = 2;  // Approved by owner
    }

    // Approve land transfer (by operator)
    public entry fun approve_transfer_by_operator(
        operator: &signer,
        land_id: u64,
    ) acquires Land, User, Operator {
        let operator_addr = signer::address_of(operator);
        assert!(operator_addr == @land_registry, EOPERATOR_NOT_AUTHORIZED);
        assert!(exists<Land>(land_id), EINVALID_CREDENTIALS);

        let land = borrow_global_mut<Land>(land_id);
        assert!(land.transfer_request.status == 2, ETRANSFER_NOT_REQUESTED);

        // Update land ownership
        let new_owner = land.transfer_request.to;
        land.owner = new_owner;
        land.is_approved = true;
        land.transfer_request.status = 3;  // Completed

        // Update user's land list
        if (exists<User>(land.transfer_request.from)) {
            let from_user = borrow_global_mut<User>(land.transfer_request.from);
            let (found, index) = vector::index_of(&from_user.lands, &land_id);
            if (found) {
                vector::remove(&mut from_user.lands, index);
            }
        };

        if (exists<User>(new_owner)) {
            let to_user = borrow_global_mut<User>(new_owner);
            vector::push_back(&mut to_user.lands, land_id);
        };

        // Remove from operator's pending approvals
        if (exists<Operator>(operator_addr)) {
            let operator = borrow_global_mut<Operator>(operator_addr);
            let (found, index) = vector::index_of(&operator.pending_approvals, &land_id);
            if (found) {
                vector::remove(&mut operator.pending_approvals, index);
            }
        };

        event::emit(TransferApprovedEvent {
            land_id,
            new_owner,
        });
    }

    // Helper function to generate land hash
    fun generate_land_hash(
        name: string::String,
        area: u64,
        location: string::String,
    ): string::String {
        // In a real implementation, this would use a cryptographic hash
        string::utf8(b"UNIQUE_HASH_") +
        name +
        string::utf8(b"_") +
        string::utf8((area as u64).to_string()) +
        string::utf8(b"_") +
        location
    }
}