const Listing = require("../model/listings");


module.exports.index = async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index", { listings: allListings })
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({
          path: "reviews" ,
          populate: {
            path: "author"
          },
        })
        .populate("owner");
        if (!listing) {
          req.flash("error", "Listing not found!");
          return res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs", { listing });
      }


module.exports.createListing = async (req, res, next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    };

module.exports.renderEditForm = async(req,res)=>{
    let{id} = req.params
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
};


module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let data = req.body.listing;

    data.price = Number(data.price) || 0;

    const listing = await Listing.findByIdAndUpdate(id, data, { new: true });
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    console.log(deletedListing);
    res.redirect("/listings")
};