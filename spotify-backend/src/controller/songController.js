import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';
import { response } from 'express';

const addSong = async (req, res) => {
	try {
		// Log dữ liệu nhận được từ request để kiểm tra
		console.log('req.files:', req.files);

		// Kiểm tra nếu không có file nào được tải lên
		if (!req.files || !req.files.audio || !req.files.image) {
			return res.status(400).json({ message: 'Audio and image files are required!' });
		}
		const name = req.body.name;
		const desc = req.body.desc;
		const album = req.body.album;
		const audioFile = req.files.audio[0];
		const imageFile = req.files.image[0];
		const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: 'video' });
		const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
		const duration = `${Math.floor(audioUpload.duration / 60)} : ${Math.floor(audioUpload.duration % 60)}`;

		const songData = {
			name,
			desc,
			album,
			image: imageUpload.secure_url,
			file: audioUpload.secure_url,
			duration,
		};

		const song = songModel(songData); 
		await song.save();

		res.json({success: true, message: 'Song added successfully!'});

	} catch (error) {
		// console.error('Error adding song:', error); // Add this line to log any errors
		res.json({success: false, message: 'Failed to add song!'});
	}
};

const listSong = async (req, res) => {
	try {
		const allSongs = await songModel.find({});
		res.json({success: true, songs: allSongs});
	} catch (error) {
		res.json({success: false, message: 'Failed to fetch songs!'});
	}
};

const removeSong = async (req, res) => {

	try {
		await songModel.findByIdAndDelete(req.body.id);
		res.json({success: true, message: 'Song removed successfully!'});
	} catch (error) {
		res.json({success: false, message: 'Failed to remove song!'});
	}
}

export { addSong, listSong, removeSong };
