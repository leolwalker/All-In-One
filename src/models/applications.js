
const { applicationCollection } = require('../database/mongoose');

async function createApplication(guildId, appName) {
  return await applicationCollection.insertOne({
    guildId,
    appName,
    questions: [],
    isActive: false,
    mainChannel: null,
    responseChannel: null,
  });
}

async function deleteApplication(name) {
  return await applicationCollection.deleteOne({ appName: name });
}

async function activateApplication(guildId, name, mainChannel, responseChannel) {
  return await applicationCollection.updateOne(
    { guildId, appName: name },
    { 
      $set: { 
        isActive: true,
        mainChannel,
        responseChannel 
      } 
    }
  );
}

async function getApplication(guildId, name) {
  return await applicationCollection.findOne({ guildId, appName: name });
}

async function addQuestion(guildId, name, question) {
  return await applicationCollection.updateOne(
    { guildId, appName: name },
    { $push: { questions: question } }
  );
}

async function removeQuestion(guildId, name, index) {
  const app = await applicationCollection.findOne({ guildId, appName: name });
  if (!app) return null;
  
  const questions = app.questions;
  questions.splice(index - 1, 1);
  
  return await applicationCollection.updateOne(
    { guildId, appName: name },
    { $set: { questions: questions } }
  );
}

module.exports = {
  createApplication,
  deleteApplication,
  activateApplication,
  getApplication,
  addQuestion,
  removeQuestion
};
