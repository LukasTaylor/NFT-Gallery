export const NFTCard = ({ nft }) => {
  return (
    <div className="w-1/4 flex flex-col ">
      <div className="rounded-md">
        <img
          className="object-cover h-128 w-full rounded-t-md"
          src={nft.media[0].gateway}
        />
      </div>
      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
        <div className="">
          <h2 className="text-xl text-gray-800">{nft.contractMetadata.name}</h2>
          <p className="text-gray-600">
            {nft.id.tokenId.substring(nft.id.tokenId.length - 4)}
          </p>
          <p className="text-gray-600">{`${nft.contract.address.substring(
            0,
            5
          )}...${nft.contract.address.substring(
            nft.contract.address.length - 4
          )}`}</p>
        </div>
        <div className="flex-grow mt-2">
          <p className="text-gray-600">{nft.description}</p>
        </div>
        <div>
          <a
            target={"_blank"}
            href={`https://etherscan.io/token/${nft.contract.address}`}
          >
            View on etherscan
          </a>
        </div>
      </div>
    </div>
  );
};
