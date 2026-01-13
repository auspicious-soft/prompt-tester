// const baseUrl = "http://localhost:8001/api/admin";
// const commonBaseUrl = "http://localhost:8001/api";
const baseUrl = "https://api.habibirizz.app/api/admin";
const commonBaseUrl = "https://api.habibirizz.app/api";

export const URLS = {
  login: `${baseUrl}/login`,
  getPickUpLine: `${baseUrl}/admin-pickup-line`,
  getManualReply: `${baseUrl}/admin-manual-message`,
  getResponseByScreenshot: `${baseUrl}/admin-get-response-by-image`,

  getAllPrompts: `${baseUrl}/all-prompts`,
  getPromptById: `${baseUrl}/prompt-byId`,
  updatePromptById: `${baseUrl}/prompt-byId`,
  loadPrompt: `${baseUrl}/sync-prompt`,

  createPrompt: `${baseUrl}/create-prompt`,
  deletePrompt: `${baseUrl}/delete-prompt`,

  promotePromptVersion: `${baseUrl}/promote-prompt`,
  promoteWebPromptVersion: `${baseUrl}/promote-web-prompt`,
  duplicatePrompt: `${baseUrl}/duplicate-prompt`,
  generateConversation: `${commonBaseUrl}/conversation/generate`,
  getConversationPrompt: `${baseUrl}/convo-prompt`,
  updateConversationPrompt: `${baseUrl}/update-convo-prompt`,
  createScenarioAndAttach: `${baseUrl}/create-scenario`,
  createRelationshipLevelAndAttach: `${baseUrl}/create-realtionship-level`,
  deleteScenarioAndDetach: `${baseUrl}/delete-scenario`,
  deleteRelationshipLevelAndDetach: `${baseUrl}/delete-relationship-level`,
  getAISettings: `${baseUrl}/ai-settings`,
  updateAISettings: `${baseUrl}/ai-settings`,
  getMergedConvoData: `${commonBaseUrl}/get-merged-data`,

  createPickupLine: `${baseUrl}/create-pickup-line`,
  adminPickupLines:`${baseUrl}/all-pickup-lines`,
  userPickUpSubmissions:`${baseUrl}/all-user-submissions`,
  getSinglePickupLine:`${baseUrl}/pickup-line/single`,
  updatePickUpLine:`${baseUrl}/pickup-lines`,
  reviewPickUpLine:`${baseUrl}/user-submissions/review`,
  deletePickupLine:`${baseUrl}/pickup-lines`,

};
