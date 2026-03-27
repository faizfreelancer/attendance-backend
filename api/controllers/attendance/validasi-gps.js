/**
 * CheckinController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const geolib = require("geolib");

module.exports = async function (req,res) {
   
    try {
        //1. Ambil token dari header
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Token tidak ada" });
        }

        //2 Ambil GPS dari body
        const {lat, long} = req.body;
        if (lat === undefined || long === undefined) {
          return res.badRequest({
            message: "latitude dan longitude wajib diisi",
          });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);

        if (isNaN(latitude) || isNaN(longitude)) {
          return res.badRequest({ message: "Format koordinat tidak valid" });
        }

        //3. Data kantor hardcode (bisa diubah jadi settingan nanti)
        const offices = await Office.find().limit(1);
        const office = offices[0];
        if(!office){
          return res
            .status(404)
            .json({ message: "Data kantor tidak ditemukan" });
        };

        //4. Cek radius menggunakan geolib
         const isWithinRadius = geolib.isPointWithinRadius(
           { latitude: latitude, longitude: longitude },
           { latitude: office.latitude, longitude: office.longitude },
           office.radius,
         );

         // 5. Hitung jarak
         const distance = geolib.getDistance(
           { latitude: latitude, longitude: longitude },
           { latitude: office.latitude, longitude: office.longitude },
         );

         // 6. Validasi radius
         if (!isWithinRadius) {
           return res.status(403).json({
             message: "Anda diluar radius kantor",
             distance: `${distance} meter`,
             radius: `${office.radius} meter`,
           });
         }

         //7. Respon jika success
            return res.ok({
            message: "Validasi GPS berhasil",
            office: office.name,
            distance: `${distance} meter`,
            });
    } catch (error) {
        return res.serverError(error);
    }

};

