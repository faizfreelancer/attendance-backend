/**
 * OfficeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req,res) {
    try {
        const {name,latitude,longitude,radius} = req.body;
        if(!name || !latitude || !longitude || !radius){
            return res.badRequest({message:"Semua field wajib diisi"})
        }

        const office = await Office.create({
            name,
            latitude,
            longitude,
            radius,
        }).fetch();

        return res.status(201).json({
            message: "Data kantor berhasil dibuat",
            office,
        });
    } catch (error) {
        return res.serverError({message:"Terjadi kesalahan pada server"})
    }
  },

  list: async function (req,res){
    try {
        const office = await Office.find();
        return res.ok({
            message: 'Daftar kantor',
            office,
        })
    } catch (error) {
       return res.serverError(error) 
    }
  },

  update: async function (req,res){
    try {
        const {id} = req.params;
        const {name,latitude,longitude,radius} = req.body;

        if(!id){
            return res.badRequest({message: "id kantor wajib diisi"})
        }

        const office = await Office.updateOne({id}).set({
            name,
            latitude,
            longitude,
            radius,
        });

        if(!office){
            return res.notFound({message: 'Kantor tidak ditemukan'})
        };

        return res.ok({
            message: "Data kantor berhasil diupdate",
            office,
        });
    } catch (error) {
       return res.serverError(error); 
    }
  },

  delete: async function (req,res){
    try {
        const {id} = req.params;
        if(!id){
            return res.badRequest({message: "id kantor wajib diisi"})
        };

        const office = await Office.destroyOne({id});
        if(!office){
            return res.notFound({message: 'Kantor tidak ditemukan'})
        }
        return res.ok({message: 'Kantor berhasil dihapus'});
    } catch (error) {
       return res.serverError(error); 
    }
  }

};

