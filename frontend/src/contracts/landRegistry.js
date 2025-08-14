import { AptosClient } from 'aptos';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const NODE_URL = 'https://fullnode.devnet.aptoslabs.com';
const MODULE_ADDRESS = '0xYOUR_MODULE_ADDRESS'; // Replace with your module address

const client = new AptosClient(NODE_URL);

export const useLandRegistry = () => {
  const { signAndSubmitTransaction, account } = useWallet();

  const registerUser = async (username, password) => {
    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::land_registry::register_user`,
      arguments: [username, password],
      type_arguments: [],
    };
    return await signAndSubmitTransaction(payload);
  };

  const registerLand = async (name, area, location) => {
    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::land_registry::register_land`,
      arguments: [name, area, location],
      type_arguments: [],
    };
    return await signAndSubmitTransaction(payload);
  };

  const requestLandTransfer = async (landId, recipient) => {
    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::land_registry::request_land_transfer`,
      arguments: [recipient, landId],
      type_arguments: [],
    };
    return await signAndSubmitTransaction(payload);
  };

  const approveTransferByOwner = async (landId) => {
    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::land_registry::approve_transfer_by_owner`,
      arguments: [landId],
      type_arguments: [],
    };
    return await signAndSubmitTransaction(payload);
  };

  const getLandsByOwner = async (ownerAddress) => {
    try {
      const resources = await client.getAccountResources(ownerAddress);
      const landResource = resources.find(r => r.type.includes('Land'));
      return landResource ? landResource.data : [];
    } catch (error) {
      console.error('Error fetching lands:', error);
      return [];
    }
  };

  return {
    registerUser,
    registerLand,
    requestLandTransfer,
    approveTransferByOwner,
    getLandsByOwner,
  };
};