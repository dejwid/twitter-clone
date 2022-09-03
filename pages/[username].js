import {useRouter} from "next/router";
import Layout from "../components/Layout";
import TopNavLink from "../components/TopNavLink";
import {useEffect, useState} from "react";
import axios from "axios";
import Cover from "../components/Cover";
import Avatar from "../components/Avatar";
import PostContent from "../components/PostContent";
import useUserInfo from "../hooks/useUserInfo";

export default function UserPage() {
  const router = useRouter();
  const {username} = router.query;
  const [profileInfo,setProfileInfo] = useState();
  const [originalUserInfo,setOriginalUserInfo] = useState();
  const {userInfo} = useUserInfo();
  const [posts,setPosts] = useState([]);
  const [postsLikedByMe,setPostsLikedByMe] = useState([]);
  const [editMode,setEditMode] = useState(false);
  const [isFollowing,setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) {
      return;
    }
    axios.get('/api/users?username='+username)
      .then(response => {
        setProfileInfo(response.data.user);
        setOriginalUserInfo(response.data.user);
        setIsFollowing(!!response.data.follow);
      })
  }, [username]);

  useEffect(() => {
    if (!profileInfo?._id) {
      return;
    }
    axios.get('/api/posts?author='+profileInfo._id)
      .then(response => {
        setPosts(response.data.posts);
        setPostsLikedByMe(response.data.idsLikedByMe);
      })
  }, [profileInfo]);

  function updateUserImage(type, src) {
    setProfileInfo(prev => ({...prev,[type]:src}));
  }

  async function updateProfile() {
    const {bio,name,username} = profileInfo;
    await axios.put('/api/profile', {
      bio,name,username
    });
    setEditMode(false);
  }

  function cancel() {
    setProfileInfo(prev => {
      const {bio,name,username} = originalUserInfo;
      return {...prev,bio,name,username};
    });
    setEditMode(false);
  }

  function toggleFollow() {
    setIsFollowing(prev => !prev);
    axios.post('/api/followers', {
      destination: profileInfo?._id,
    })
  }

  const isMyProfile = profileInfo?._id === userInfo?._id;

  return (
    <Layout>
      {!!profileInfo && (
        <div>
          <div className="px-5 pt-2">
            <TopNavLink title={profileInfo.name} />
          </div>
          <Cover src={profileInfo.cover}
                 editable={isMyProfile}
                 onChange={src => updateUserImage('cover',src)} />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute -top-12 border-4 rounded-full border-black overflow-hidden">
                <Avatar big src={profileInfo.image} editable={isMyProfile}
                        onChange={src => updateUserImage('image',src)} />
              </div>
            </div>
            <div className="p-2">
              {!isMyProfile && (
                <button onClick={toggleFollow}
                        className={(isFollowing ? 'bg-twitterWhite text-black' : 'bg-twitterBlue text-white')+" py-2 px-5 rounded-full"}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              {isMyProfile && (
                <div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-twitterBlue text-white py-2 px-5 rounded-full">Edit profile</button>
                  )}
                  {editMode && (
                    <div>
                      <button
                        onClick={() => cancel()}
                        className="bg-twitterWhite text-black py-2 px-5 rounded-full mr-2">Cancel</button>
                      <button
                        onClick={() => updateProfile()}
                        className="bg-twitterBlue text-white py-2 px-5 rounded-full">Save profile</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="px-5 mt-2">
            {!editMode && (
              <h1 className="font-bold text-xl leading-5">{profileInfo.name}</h1>
            )}
            {editMode && (
              <div>
                <input type="text" value={profileInfo.name}
                       onChange={ev => setProfileInfo(prev => ({...prev,name:ev.target.value}))}
                       className="bg-twitterBorder p-2 mb-2 rounded-full"/>
              </div>
            )}
            {!editMode && (
              <h2 className="text-twitterLightGray text-sm">@{profileInfo.username}</h2>
            )}
            {editMode && (
              <div>
                <input type="text" value={profileInfo.username}
                       onChange={ev => setProfileInfo(prev => ({...prev,username:ev.target.value}))}
                       className="bg-twitterBorder p-2 mb-2 rounded-full"/>
              </div>
            )}
            {!editMode && (
              <div className="text-sm mt-2 mb-2">{profileInfo.bio}</div>
            )}
            {editMode && (
              <div>
                <textarea value={profileInfo.bio}
                          onChange={ev => setProfileInfo(prev => ({...prev,bio:ev.target.value}))}
                          className="bg-twitterBorder p-2 mb-2 rounded-2xl w-full block"  />
              </div>
            )}
          </div>
        </div>
      )}
      {posts?.length > 0 && posts.map(post => (
        <div className="p-5 border-t border-twitterBorder" key={post._id}>
          <PostContent {...post} likedByMe={postsLikedByMe.includes(post._id)} />
        </div>
      ))}
    </Layout>
  );
}