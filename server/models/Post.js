import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
// const Post is somewhat like a contructor fucntion for the model
// this word is used to create new instances of documents that will be stored in the MongoDB database
// "Post" -> Specifies the name of the model 
// "Post" is used to identify the collection in the MongoDB database where documents of this type will be stored. 
export default Post;