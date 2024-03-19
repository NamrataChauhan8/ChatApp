const express=require('express');

const dotenv =require('dotenv') ;
const config= dotenv.config();

const jwt = require("jsonwebtoken");

const secretKey=process.env.SECRET_KEY;

const messages = require("../model/message");
const user = require("../model/User");

const mongoose = require('mongoose');
const dbConnectionString = process.env.DB_CONNECTION_STRING;

module.exports = { express, dotenv, config, jwt, secretKey, messages, user, mongoose, dbConnectionString};
