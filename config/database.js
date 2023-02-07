const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
// const { MongooseFindByReference } = require("mongoose-find-by-reference");
const mongoosePaginate = require("mongoose-paginate-v2");
const { mongooseSubqueryPlugin } = require("mongoose-subquery");

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected Successfully");
  });

// mongoose.set("debug", true);

mongoose.plugin(mongoosePaginate);
mongoose.plugin(mongooseSubqueryPlugin);
mongoose.plugin(slug);
// mongoose.plugin(MongooseFindByReference);

module.exports = mongoose;
