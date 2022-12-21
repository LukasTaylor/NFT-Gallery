import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { NFTCard } from "./components/nftCard";

const Home = () => {
  //create  state variables to store wallet and collection addresses. Addresses are strings - so initialize to empty string. Functions to update state variables.
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  //create state variable to store nfts & function to update. Returns an array of nfts - so initialize to empty array.
  const [nfts, setNFTs] = useState([]);
  //create state variable to store if the user wants to fetch by collection - default is set to fetch by address
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;

    const baseURL = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.alchemyApiKey}/getNFTs`;

    // options passed to fetch()
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    //if the collection is empty(length is 0 - collection address not provided) fetch all NFTs owned by provided wallet address
    if (!collection.length) {
      console.log("nfts for wallet: ", wallet);
      //URL to GET data from Alchemy API
      const fetchURL = `${baseURL}?owner=${wallet}`;
      //fetch data from Alchemy API and set returns data to nfts
      nfts = await fetch(fetchURL, options)
        .then((response) => response.json())
        .then((data) => (nfts = data))
        .catch((err) => console.error(err));
      //Wallet address and collection address are provided - filter by collection owned by wallet
    } else {
      console.log(
        `fetching nfts for collection address: ${collection} owned by wallet address: ${wallet}`
      );
      //URL to GET data from Alchemy API
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      //fetch data from Alchemy API and set returns data to nfts
      await fetch(fetchURL, options)
        .then((response) => response.json())
        .then((data) => (nfts = data))
        .catch((err) => console.error(err));
    }
    if (nfts) {
      console.log("nfts: ", nfts);
      //only want to grab the ownedNfts property from returned object
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNftsForCollection = async () => {
    let nfts;
    // options passed to fetch()
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };
    const baseURL = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.alchemyApiKey}/getNFTsForCollection`;

    //check if collection address is provided
    if (collection.length) {
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=true`;
      await fetch(fetchURL, options)
        .then((response) => response.json())
        .then((data) => (nfts = data))
        .catch((err) => console.error(err));
      if (nfts) {
        console.log("NFTs in collection: ", nfts);
        //only want to grab the nfts property from the object returned
        setNFTs(nfts.nfts);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50 rounded-lg"
          disabled={fetchForCollection}
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50 rounded-lg"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600 ">
          <input
            className="mr-2"
            onChange={(e) => setFetchForCollection(e.target.checked)}
            type={"checkbox"}
          ></input>
          Fetch for collection
        </label>
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-lg w-1/5"
          }
          onClick={() => {
            if (fetchForCollection) {
              fetchNftsForCollection();
            } else {
              fetchNFTs();
            }
          }}
        >
          Let's Go!
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {nfts.length &&
          nfts.map((nft) => {
            return <NFTCard key={nft.id.tokenId} nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
