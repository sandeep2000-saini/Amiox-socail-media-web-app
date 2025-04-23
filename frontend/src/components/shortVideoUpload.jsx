import React, { useState } from 'react'

const ShortVideoUpload = () => {
    const [video, setVideo] = useState(null);
    const [videoURL, setVideoURL] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [postFor, setPostFor] = useState("Everyone");
    const [schedule, setSchedule] = useState("");
    const [mood, setMood] = useState("Neutral");
    const [visibility, setVisibility] = useState("Public");
    const [uploadProgress, setUploadProgress] = useState(0); // New state variable
    const [isUploading, setIsUploading] = useState(false); // New state variable

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            setVideoURL(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setVideo(null);
        setVideoURL("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadProgress(0);

        const fakeUpload = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(fakeUpload);
                    setIsUploading(false);
                    alert("Video uploaded successfully!");
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white  rounded-lg flex gap-6">
            <div className="w-1/2">
                <label className="block mb-4">
                    <span className="text-gray-700">Select Video</span>
                    <input type="file" accept="video/*" className="mt-2 block w-full" onChange={handleVideoChange} />
                </label>
                {videoURL && (
                    <>
                        <video controls className="w-[180px]">
                            <source src={videoURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button onClick={handleCancel} className="mt-2 bg-red-600 text-white p-2 rounded">Cancel Selection</button>
                    </>
                )}
            </div>
            <div className="w-1/2">
                <form onSubmit={handleSubmit}>
                    <textarea placeholder="Write a centent" className="w-full p-2 border mb-2" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    <input type="text" placeholder="Tags (comma-separated)" className="w-full p-2 border mb-2" value={tags} onChange={(e) => setTags(e.target.value)} />
                    <select className="w-full p-2 border mb-2" value={postFor} onChange={(e) => setPostFor(e.target.value)}>
                    <option value="">Post type</option>
                  <option value="Both">For All</option>
                  {/* is type ka content sab ko dekha ga */}
                  <option value="18+">Child Lock</option>
                    </select>
                    <input type="datetime-local" className="w-full p-2 border mb-2" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
                    <select className="w-full p-2 border mb-2" value={mood} onChange={(e) => setMood(e.target.value)}>
                    <option value="">mood</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="excited">Excited</option>
                  <option value="calm">Calm</option>
                    </select>
                    <select className="w-full p-2 border mb-4" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                    <option value="">visibility</option>
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="private">Private</option>
                    </select>
                    {isUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ShortVideoUpload