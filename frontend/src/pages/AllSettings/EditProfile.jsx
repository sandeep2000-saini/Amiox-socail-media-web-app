import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../lib/cropImageHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAuthUser } from "../../redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);

  const [formData, setFormData] = useState({
    userId: user?.userId || "",
    fullName: user?.fullname || "",
    email: user?.email || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
    backgroundImage: null,
    previewImage: null,
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, previewImage: reader.result, file });
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        formData.previewImage,
        croppedAreaPixels
      );
      setFormData({
        ...formData,
        backgroundImage: croppedImage,
        previewImage: croppedImage,
      });
      setIsCropping(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleCropCancel = () => {
    setFormData({ ...formData, previewImage: null });
    document.getElementById("backgroundImage").value = null;
    setIsCropping(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          userId: res.data.user?.userID,
          fullname: res.data.user?.fullname,
          email: res.data.user?.email,
          bio: res.data.user?.bio,
          backgroundImage: res.data.user?.backgroundImage,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
        navigate(`/profile/${user.id}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response.data.message);
      console.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Edit Profile
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="userId"
                >
                  User ID
                </label>
                <input
                  id="userID"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="Enter your user ID"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="backgroundImage"
                >
                  Background Image
                </label>
                <input
                  id="backgroundImage"
                  name="backgroundImage"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {formData.previewImage && (
                  <img
                    src={formData.previewImage}
                    alt="Preview"
                    className="mt-4 w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write something about yourself"
                  className="w-full border border-gray-300 rounded p-2"
                ></textarea>
              </div>
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {loading ? (
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Please wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              )}
            </form>
          </div>
        </div>

        {isCropping && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Crop Image</h2>
              <div className="relative w-[600px] h-[450px]">
                <Cropper
                  image={formData.previewImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCropCancel}
                  className="bg-gray-300 text-black py-2 px-4 rounded mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditProfile;
