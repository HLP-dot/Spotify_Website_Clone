import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

const addAlbum = async (req, res) => {
	try {
		const { name, desc, bgColour } = req.body;
		const imageFile = req.file;
		const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });

		const albumData = {
			name,
			desc,
			bgColour,
			image: imageUpload.secure_url,
		};

		const album = albumModel(albumData);
		await album.save();

		res.json({ success: true, message: 'Album added successfully!' });
	} catch (error) {
		res.json({ success: false, message: 'Failed to add album!' });
	}
};

const listAlbum = async (req, res) => {
	try {
		const allAlbums = await albumModel.find({});
		res.json({ success: true, albums: allAlbums });
	} catch (error) {
		res.json({ success: false });
	}
};

const removeAlbum = async (req, res) => {
	try {
		const { id } = req.body;
		await albumModel.findByIdAndDelete(id);

		res.json({ success: true, message: 'Album removed successfully' });
	} catch (error) {
        res.json({ success: false, message: 'Failed to remove album' });
    }
};

export { addAlbum, listAlbum, removeAlbum };
