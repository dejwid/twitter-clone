import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import PostContent from "../../../components/PostContent";
import Layout from "../../../components/Layout";
import Link from "next/link";
import useUserInfo from "../../../hooks/useUserInfo";
import PostForm from "../../../components/PostForm";
import TopNavLink from "../../../components/TopNavLink";

export default function PostPage() {
  const router = useRouter();
  const {id} = router.query;
  const [post,setPost] = useState();
  const [replies,setReplies] = useState([]);
  const [repliesLikedByMe,setRepliesLikedByMe] = useState([]);
  const {userInfo} = useUserInfo();

  function fetchData() {
    axios.get('/api/posts?id='+id)
      .then(response => {
        setPost(response.data.post);
      });
    axios.get('/api/posts?parent='+id)
      .then(response => {
        setReplies(response.data.posts);
        setRepliesLikedByMe(response.data.idsLikedByMe);
      })
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchData();
  }, [id]);

  return (
    <Layout>
      {!!post?._id && (
        <div className="px-5 py-2">
          <TopNavLink />
          {post.parent && (
            <div className="pb-1">
              <PostContent {...post.parent} />
              <div className="ml-5 h-12 relative">
                <div className="h-20 border-l-2 border-twitterBorder absolute -top-5"
                     style={{marginLeft:'2px'}}></div>
              </div>
            </div>
          )}
          <div>
            <PostContent {...post} big />
          </div>
        </div>
      )}
      {!!userInfo && (
        <div className="border-t border-twitterBorder py-5">
          <PostForm onPost={fetchData}
                    parent={id}
                    compact placeholder={'Tweet your reply'} />
        </div>
      )}
      <div className="">
        {replies.length > 0 && replies.map(reply => (
          <div className="p-5 border-t border-twitterBorder" key={reply._id}>
            <PostContent {...reply} likedByMe={repliesLikedByMe.includes(reply._id)} />
          </div>
        ))}
      </div>
    </Layout>
  );
}