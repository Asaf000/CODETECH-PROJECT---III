# 🧪 Testing Guide & Feature Checklist

## Testing the Application

### Prerequisites
- Server running on http://localhost:5000
- Client running on http://localhost:3000
- MongoDB running and accessible

---

## Manual Testing Checklist

### ✅ Basic Functionality

#### 1. Home Page
- [ ] Page loads without errors
- [ ] "Create New Document" button is visible
- [ ] Heading and description are displayed correctly
- [ ] No documents shows empty state message
- [ ] Loading spinner appears while fetching documents

#### 2. Document Creation
- [ ] Click "Create New Document" button
- [ ] Redirects to /document/:id with unique ID
- [ ] Editor loads successfully
- [ ] Default title "Untitled Document" is shown
- [ ] Toolbar is visible with all formatting options

#### 3. Text Editing
- [ ] Can type text in editor
- [ ] Text appears immediately
- [ ] Can format text (bold, italic, underline)
- [ ] Can change font size and style
- [ ] Can create lists (ordered and unordered)
- [ ] Can add links
- [ ] Can change text color and background
- [ ] Can align text (left, center, right)
- [ ] Can add code blocks and blockquotes

#### 4. Document Title
- [ ] Can edit document title
- [ ] Title updates immediately
- [ ] Title persists after refresh

#### 5. Auto-save
- [ ] Content automatically saves every 2 seconds
- [ ] No manual save button needed
- [ ] Refresh page and content is preserved
- [ ] Title changes are saved

#### 6. Document List
- [ ] Return to home page
- [ ] Created document appears in list
- [ ] Document card shows title
- [ ] Document card shows last updated time
- [ ] Document ID is displayed
- [ ] Click document card to open it

#### 7. Document Deletion
- [ ] Hover over document card
- [ ] Delete button appears
- [ ] Click delete button
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Document is removed from list
- [ ] Deleted document is removed from database

---

### ✅ Real-time Collaboration

#### Setup for Collaboration Testing
1. Open browser window 1: http://localhost:3000/document/test123
2. Open browser window 2 (incognito): http://localhost:3000/document/test123

#### Tests

##### 1. User Presence
- [ ] Window 1 shows "Active Users: Only you" initially
- [ ] Open Window 2
- [ ] Window 1 now shows "Active Users: 2 users"
- [ ] Each user has a colored badge
- [ ] Different usernames displayed (e.g., User42, User789)

##### 2. Real-time Text Sync
- [ ] Type in Window 1
- [ ] Text appears in Window 2 immediately
- [ ] Type in Window 2
- [ ] Text appears in Window 1 immediately
- [ ] No conflicts or overwrites
- [ ] Formatting is synced correctly

##### 3. Simultaneous Editing
- [ ] Both users type at same time in different paragraphs
- [ ] Both texts appear correctly in both windows
- [ ] No data loss
- [ ] Cursor positions maintained

##### 4. Title Synchronization
- [ ] Change title in Window 1
- [ ] Title updates in Window 2
- [ ] Change title in Window 2
- [ ] Title updates in Window 1

##### 5. User Disconnect
- [ ] Close Window 2
- [ ] Window 1 shows user count decreased
- [ ] User badge removed
- [ ] Editing continues normally in Window 1

##### 6. Reconnection
- [ ] Disconnect internet
- [ ] Try to type (won't sync)
- [ ] Reconnect internet
- [ ] Socket.io reconnects automatically
- [ ] Changes sync again

---

### ✅ Performance Testing

#### 1. Large Documents
- [ ] Type 1000+ words
- [ ] Scrolling is smooth
- [ ] Auto-save works correctly
- [ ] Page doesn't lag

#### 2. Multiple Documents
- [ ] Create 10+ documents
- [ ] List view loads quickly
- [ ] No performance degradation
- [ ] Can still create new documents

#### 3. Multiple Users
- [ ] Test with 5+ simultaneous users
- [ ] All users see changes
- [ ] No significant lag
- [ ] Active users list updates correctly

---

### ✅ Error Handling

#### 1. No Database Connection
- [ ] Stop MongoDB
- [ ] Try to create document
- [ ] Appropriate error handling
- [ ] User sees error message
- [ ] App doesn't crash

#### 2. Network Issues
- [ ] Disconnect internet
- [ ] Try to save document
- [ ] Graceful degradation
- [ ] Socket reconnects when back online

#### 3. Invalid Document ID
- [ ] Navigate to /document/invalid-id
- [ ] New document is created
- [ ] No errors or crashes

#### 4. Browser Refresh
- [ ] Edit document
- [ ] Refresh page (F5)
- [ ] Content is preserved
- [ ] Active users list updates
- [ ] Editing continues normally

---

### ✅ UI/UX Testing

#### 1. Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px width)
- [ ] Test on mobile (375px width)
- [ ] All elements are accessible
- [ ] No horizontal scrolling
- [ ] Buttons are touchable on mobile

#### 2. Visual Design
- [ ] Colors are consistent
- [ ] Fonts are readable
- [ ] Icons are clear
- [ ] Animations are smooth
- [ ] No visual glitches

#### 3. Navigation
- [ ] "Back to Documents" button works
- [ ] Browser back button works
- [ ] Can navigate between documents
- [ ] URLs update correctly

---

## Automated Testing (Optional)

### Unit Tests

Create test file: `client/src/components/Editor.test.js`

```javascript
import { render, screen } from '@testing-library/react';
import Editor from './Editor';

test('renders editor component', () => {
  render(<Editor documentId="test123" />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
```

Run tests:
```bash
cd client
npm test
```

### Integration Tests

Create test file: `server/server.test.js`

```javascript
const request = require('supertest');
const app = require('./server');

describe('API Endpoints', () => {
  test('GET /api/documents returns documents', async () => {
    const response = await request(app).get('/api/documents');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

---

## Load Testing

### Using Apache Bench

```bash
# Test document creation
ab -n 100 -c 10 http://localhost:5000/api/documents

# Test document retrieval
ab -n 1000 -c 50 http://localhost:5000/api/documents
```

### Using Socket.io Load Testing

Install socket.io-client-load-tester:
```bash
npm install -g socket.io-client-load-tester
```

Run load test:
```bash
socket.io-client-load-tester \
  --server http://localhost:5000 \
  --clients 100 \
  --duration 60
```

---

## Browser Compatibility Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

---

## Security Testing

### 1. XSS Testing
- [ ] Try to inject `<script>alert('XSS')</script>` in title
- [ ] Try to inject scripts in content
- [ ] Verify scripts don't execute

### 2. SQL/NoSQL Injection
- [ ] Try document ID: `test'; DROP TABLE documents; --`
- [ ] Verify MongoDB query sanitization
- [ ] No database errors

### 3. CORS Testing
- [ ] Access API from different origin
- [ ] Verify CORS headers
- [ ] Unauthorized origins blocked

---

## Accessibility Testing

### WCAG Compliance
- [ ] All images have alt text
- [ ] Proper heading hierarchy
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets AA standards
- [ ] Screen reader compatible

### Keyboard Navigation
- [ ] Tab through all elements
- [ ] Enter/Space to activate buttons
- [ ] Esc to close dialogs
- [ ] No keyboard traps

---

## Performance Metrics

### Target Metrics
- **Page Load Time:** < 2 seconds
- **Time to Interactive:** < 3 seconds
- **First Contentful Paint:** < 1 second
- **API Response Time:** < 200ms
- **WebSocket Latency:** < 50ms

### Measuring with Chrome DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check load times
5. Go to Performance tab
6. Record and analyze

---

## Known Issues & Limitations

### Current Limitations
1. No user authentication
2. No document permissions
3. No version history
4. No offline mode
5. Limited to text content
6. No collaborative cursors
7. No comments/suggestions

### Browser Limitations
- WebSocket support required
- Local Storage required
- Modern ES6+ browser needed

---

## Test Data

### Sample Documents

**Test Document 1:**
- ID: test-doc-1
- Title: "Team Meeting Notes"
- Content: Formatted text with lists, bold, italic

**Test Document 2:**
- ID: test-doc-2
- Title: "Project Proposal"
- Content: Headers, paragraphs, links

**Test Document 3:**
- ID: test-doc-3
- Title: "Code Review"
- Content: Code blocks, blockquotes

---

## Reporting Issues

When reporting bugs, include:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Browser and version**
5. **Console errors**
6. **Screenshots/videos**

---

## Success Criteria

The application passes testing if:
- ✅ All basic functionality works
- ✅ Real-time collaboration works with 2+ users
- ✅ No critical bugs or crashes
- ✅ Performance is acceptable
- ✅ UI is responsive on all devices
- ✅ Data persists correctly
- ✅ Error handling is graceful

---

**Good luck with testing your CODTECH Internship project! 🎯**
