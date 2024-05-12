import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConnection = () => {

    cloudinary.config({
        cloud_name:'drym71mrj',
        api_key: '228239762923251',
        api_secret: '2j-NtCBICJ0h5a0B6RijyZBDQvM'
    });
    return cloudinary;
}

export default cloudinaryConnection;