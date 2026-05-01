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
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
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