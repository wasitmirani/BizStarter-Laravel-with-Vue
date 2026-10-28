import client, { unwrap } from './api';

const AdmissionsService = {
    dashboard() {
        return client.get('/dashboard').then(unwrap);
    },

    me() {
        return client.get('/me').then(unwrap);
    },

    profile() {
        return client.get('/profile').then(unwrap);
    },

    updateProfile(payload: Record<string, any>) {
        return client.put('/profile', payload).then(unwrap);
    },

    // Education
    createEducation(payload: Record<string, any>) {
        return client.post('/education', payload).then(unwrap);
    },
    updateEducation(id: number, payload: Record<string, any>) {
        return client.put(`/education/${id}`, payload).then(unwrap);
    },
    deleteEducation(id: number) {
        return client.delete(`/education/${id}`).then(unwrap);
    },

    // Language qualifications
    createLanguage(payload: Record<string, any>) {
        return client.post('/language-qualifications', payload).then(unwrap);
    },
    updateLanguage(id: number, payload: Record<string, any>) {
        return client.put(`/language-qualifications/${id}`, payload).then(unwrap);
    },
    deleteLanguage(id: number) {
        return client.delete(`/language-qualifications/${id}`).then(unwrap);
    },

    // Work experience
    createWork(payload: Record<string, any>) {
        return client.post('/work-experiences', payload).then(unwrap);
    },
    updateWork(id: number, payload: Record<string, any>) {
        return client.put(`/work-experiences/${id}`, payload).then(unwrap);
    },
    deleteWork(id: number) {
        return client.delete(`/work-experiences/${id}`).then(unwrap);
    },

    // Study preferences
    preferences() {
        return client.get('/preferences').then(unwrap);
    },
    updatePreferences(payload: Record<string, any>) {
        return client.put('/preferences', payload).then(unwrap);
    },

    // Notification preferences
    notificationPreferences() {
        return client.get('/notification-preferences').then(unwrap);
    },
    updateNotificationPreferences(payload: Record<string, any>) {
        return client.put('/notification-preferences', payload).then(unwrap);
    },

    // Catalog
    programs(params: Record<string, any> = {}) {
        return client.get('/programs', { params }).then(unwrap);
    },
    program(id: number) {
        return client.get(`/programs/${id}`).then(unwrap);
    },
    universities(params: Record<string, any> = {}) {
        return client.get('/universities', { params }).then(unwrap);
    },
    university(id: number) {
        return client.get(`/universities/${id}`).then(unwrap);
    },
    syncCatalog(universityId?: number) {
        return client.post('/catalog/sync', universityId ? { university_id: universityId } : {}).then(unwrap);
    },
    scholarships(params: Record<string, any> = {}) {
        return client.get('/scholarships', { params }).then(unwrap);
    },

    // Eligibility
    eligibility(params: Record<string, any> = {}) {
        return client.get('/eligibility', { params }).then(unwrap);
    },
    reassess() {
        return client.post('/eligibility/reassess').then(unwrap);
    },

    // Bookmarks
    bookmarks() {
        return client.get('/bookmarks').then(unwrap);
    },
    bookmark(programId: number) {
        return client.post('/bookmarks', { program_id: programId }).then(unwrap);
    },
    removeBookmark(programId: number) {
        return client.delete(`/bookmarks/${programId}`).then(unwrap);
    },

    // Applications
    applications(params: Record<string, any> = {}) {
        return client.get('/applications', { params }).then(unwrap);
    },
    application(id: number) {
        return client.get(`/applications/${id}`).then(unwrap);
    },
    createApplication(payload: Record<string, any>) {
        return client.post('/applications', payload).then(unwrap);
    },
    updateApplication(id: number, payload: Record<string, any>) {
        return client.put(`/applications/${id}`, payload).then(unwrap);
    },
    deleteApplication(id: number) {
        return client.delete(`/applications/${id}`).then(unwrap);
    },

    // Documents
    documents(params: Record<string, any> = {}) {
        return client.get('/documents', { params }).then(unwrap);
    },
    uploadDocument(payload: FormData) {
        return client
            .post('/documents', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(unwrap);
    },
    async downloadDocument(id: number, fallbackName = 'document') {
        const response = await client.get(`/documents/${id}/download`, { responseType: 'blob' });
        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fallbackName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    },
    deleteDocument(id: number) {
        return client.delete(`/documents/${id}`).then(unwrap);
    },

    // Tasks
    tasks(params: Record<string, any> = {}) {
        return client.get('/tasks', { params }).then(unwrap);
    },
    createTask(payload: Record<string, any>) {
        return client.post('/tasks', payload).then(unwrap);
    },
    updateTask(id: number, payload: Record<string, any>) {
        return client.put(`/tasks/${id}`, payload).then(unwrap);
    },
    deleteTask(id: number) {
        return client.delete(`/tasks/${id}`).then(unwrap);
    },

    // Reports
    reports(params: Record<string, any> = {}) {
        return client.get('/reports', { params }).then(unwrap);
    },
    generateReport() {
        return client.post('/reports/generate').then(unwrap);
    },

    // Account
    account() {
        return client.get('/account').then(unwrap);
    },
    updateAccount(payload: Record<string, any>) {
        return client.patch('/account', payload).then(unwrap);
    },
    updateAccountPassword(payload: Record<string, any>) {
        return client.post('/account/password', payload).then(unwrap);
    },
    uploadAccountAvatar(form: FormData) {
        return client
            .post('/account/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(unwrap);
    },
    notifications() {
        return client.get('/notifications').then(unwrap);
    },
    exportAccount() {
        return client.get('/account/export').then(unwrap);
    },
    deleteAccount(password: string) {
        return client.delete('/account', { data: { password } }).then(unwrap);
    },
};

export type AdmissionsServiceType = typeof AdmissionsService;
export default AdmissionsService;
