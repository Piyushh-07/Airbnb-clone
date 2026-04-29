const Listing = require("../model/listings");


module.exports.index = async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index", { listings: allListings })
};