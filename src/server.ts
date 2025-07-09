import { Request, Response } from "express";
import app from "./app";

const express = require('express');
const mongoose = require('mongoose');


const port = 4000;

const startServer = async () =>{
    try {
        await mongoose.connect(
          "mongodb+srv://mongodb:mongodb@cluster0.uqid44n.mongodb.net/TourBackendDB?retryWrites=true&w=majority&appName=Cluster0"
        );
        console.log("database connected successfully");
        app.listen (port, ()=>{
            console.log(`server is running on port ${port}`);
        })
        
    } catch (error) {
        console.log (error);
        
    }
 
}

startServer();