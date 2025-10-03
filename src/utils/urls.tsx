// const baseUrl = "http://localhost:8001/api/admin";
const baseUrl = "https://api.habibirizz.app/api/admin";

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
};
