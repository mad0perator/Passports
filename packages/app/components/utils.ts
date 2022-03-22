import axios from "axios";
import Web3 from "web3";
// @ts-ignore They don't have a types file available -.-
import namehash from "@ensdomains/eth-ens-namehash";

export const ipfsAdd = (s: string | Blob) => {
  const formData = new FormData();
  formData.append("files", s);
  return axios
    .post<{ Hash: string }>(
      "https://ipfs.infura.io:5001/api/v0/add",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((r) => r.data.Hash);
};

export const resolveAddress = (addr: string, web3: Web3) =>
  addr.endsWith(".eth")
    ? web3.eth.ens.getAddress(addr).catch(() => "")
    : addr.startsWith("0x")
    ? Promise.resolve(addr)
    : Promise.resolve("");

export const lookupAddress = async (
  addr: string,
  web3: Web3
): Promise<string> => {
  const lookup = addr.toLowerCase().substr(2) + ".addr.reverse";
  return web3.eth.ens
    .resolver(lookup)
    .then((ResolverContract) => {
      const nh = namehash.hash(lookup);
      return ResolverContract.methods.name(nh).call();
    })
    .catch(() => addr);
};

export const getWeb3 = (networkName: string) =>
  new Web3(
    networkName === "localhost"
      ? "http://localhost:8545"
      : `https://eth-${networkName}.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
  );

export const getAllManagedMemberships = ({
  web3, // web3 is unused for now - but we might need it when we migrate from firebase to the graph or some other blockchain indexer
  chainId,
  from,
}: {
  web3: Web3;
  chainId: number;
  from: string;
}) => {
  return axios
    .get(`/api/admin/stamps?address=${from}&chain=${chainId}`)
    .then((s) => s.data.addresses as string[]);
};
