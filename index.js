const wait = require('wait')
require('dotenv').config()
require('module-alias/register')
const path = require('path')
const Bitzxier = require(`./structures/Bitzxier.js`)
const client = new Bitzxier()
const GiveawayManager = require("./handler/GiveawayManager");
this.config = require(`./config.json`)

client.emoji = {
'tick': '<:tick:1277612193965412364>', 
'cross':'<:cross:1277611886820593780>',
  'dot': '<a:flame_dot:1277614248914325585>',
  
  'giveaway': '<a:giveaway:1299096208106590319>'
};

client.giveawaysManager = new GiveawayManager(client);



async function initializeMongoose() {
    console.log('Initializing Mongoose...');
    await client.initializeMongoose()
    console.log('Mongoose initialized');
}

async function initializeData() {
    console.log('Initializing data...');
    await client.initializedata()
    console.log('Data initialized');
}

async function waitThreeSeconds() {
    console.log('Waiting for 3 seconds...');
    await wait(3000);
    console.log('Wait completed');
}

async function loadEvents() {
    console.log('Loading events...');
    await client.loadEvents()
    console.log('Events loaded');
}

async function loadLogs() {
    console.log('Loading logs...');
    await client.loadlogs()
    console.log('Logs loaded');
}

async function loadMain() {
    console.log('Loading main...');
    await client.loadMain()
    console.log('Main loaded');
}

async function loginBot() {
    console.log('Logging in...');
    const settings = require('./config.json')
    await client.login(settings.TOKEN)
    console.log('Logged in');
}

async function main() {
    try {
        await initializeMongoose()
        await initializeData()
        await waitThreeSeconds()
        await loadEvents()
        await loadLogs()
        await loadMain()
        await loginBot()
    } catch (error) {
        console.error('Error:', error);
    }
}

main()