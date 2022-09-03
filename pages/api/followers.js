import {initMongoose} from "../../lib/mongoose";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "./auth/[...nextauth]";
import Follower from "../../models/Follower";

export default async function handle(req, res) {
  await initMongoose();
  const session = await unstable_getServerSession(req, res, authOptions);
  const {destination} = req.body;

  const existingFollow = await Follower.findOne({destination,source:session.user.id});
  if (existingFollow) {
    await existingFollow.remove();
    res.json(null);
  } else {
    const f = await Follower.create({destination,source:session.user.id});
    res.json(f);
  }
}