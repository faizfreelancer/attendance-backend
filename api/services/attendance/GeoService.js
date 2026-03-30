/**
 * CheckinController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const geolib = require("geolib");

module.exports = {
  async isWithinRadius(data) {
    // //1. Ambil token dari header
    // const authHeader = req.headers["authorization"];
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ message: "Token tidak ada" });
    // }

    //1 Ambil GPS dari body
    const { lat, long } = data;
    if (lat === undefined || long === undefined) {
      throw new Error("latitude dan longitude wajib diisi");
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Format koordinat tidak valid");
    }

    //2. Data kantor hardcode (bisa diubah jadi settingan nanti)
    const offices = await Office.find().limit(1);
    const office = offices[0];
    if (!office) {
      throw new Error("Data kantor tidak ditemukan");
    }

    //3. Cek radius menggunakan geolib
    const isWithin = geolib.isPointWithinRadius(
      { latitude: latitude, longitude: longitude },
      { latitude: office.latitude, longitude: office.longitude },
      office.radius,
    );

    // 4. Hitung jarak
    const distance = geolib.getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: office.latitude, longitude: office.longitude },
    );

    // 5. Validasi radius
    if (!isWithin) {
      throw new Error(`Diluar radius. Jarak: ${distance} meter`);
    }

    //6. Respon jika success
    return {
      message: "Validasi GPS berhasil",
      office: office.name,
      distance: `${distance} meter`,
    };
  },
};
