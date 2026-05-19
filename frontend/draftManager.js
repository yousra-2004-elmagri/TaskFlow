cconst DraftManager = {

  save: function(projectId, formData) {
    const draft = {
      ...formData,
      _savedAt: new Date().toISOString()
    };
    localStorage.setItem('taskflow_draft_' + projectId, JSON.stringify(draft));
  },

  load: function(projectId) {
    const raw = localStorage.getItem('taskflow_draft_' + projectId);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clear: function(projectId) {
    localStorage.removeItem('taskflow_draft_' + projectId);
  }

};