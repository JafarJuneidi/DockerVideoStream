import React from 'react';

interface VideoPlayerProps {
    videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    return (
        <video className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
}

export default VideoPlayer;

