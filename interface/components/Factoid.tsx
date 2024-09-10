//A standard factoid tile for showing in a list or grid view
const Factoid = ({ factoid, handleReportClick }) => {
    return (
      <div onClick={(e) => handleReportClick(factoid)} key={factoid.id} className="rounded-lg overflow-hidden">
        <img
          src={factoid.cover_image ? `${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/${factoid.cover_image}` : "/placeholder.svg"}
          alt={factoid.claim}
          className="aspect-[3/2] object-cover"
        />
        <div className="p-4 bg-background">
          <h3 className="text-accent-foreground line-clamp-2 xl:line-clamp-1 text-lg font-semibold">
            {factoid.parsed.publication_info?.catchy_title || factoid.claim}
          </h3>
          <p className="text-muted-foreground line-clamp-3">{factoid.evaluation}</p>
        </div>
      </div>
    );
  };
export default Factoid