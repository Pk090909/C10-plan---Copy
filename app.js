require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Task = require('./models/Task');
const { config } = require('process');
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



const subjectSchema = new mongoose.Schema({
  name: String,
  chapters: [
      {
          title: String,
          status: String, // Not Started, In Progress, Completed
          difficulty: String, // Easy, Medium, Hard
          revisions: Number,
          testDone: Boolean,
      },
  ],
});

const Subject = mongoose.model('Subject', subjectSchema);


// Routes
app.get('/', async (req, res) => {
    const tasks = await Task.find({});
    res.render('dashboard', { tasks, daysLeft: 45 });
});

// Get all subjects
app.get('/subjects', async (req, res) => {
  const subjects = await Subject.find({});
  res.render('subjects', { subjects });
});

// Add a new subject
app.post('/subjects', async (req, res) => {
  const newSubject = new Subject({ name: req.body.subjectName, chapters: [] });
  await newSubject.save();
  res.redirect('/subjects');
});

// View a specific subject's chapters
app.get('/subjects/:id', async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  res.render('subject-detail', { subject });
});

// Add a chapter to a subject
app.post('/subjects/:id/chapters', async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  subject.chapters.push({
      title: req.body.chapterTitle,
      status: "Not Started",
      difficulty: req.body.difficulty,
      revisions: 0,
      testDone: false,
  });
  await subject.save();
  res.redirect(`/subjects/${req.params.id}`);
});

// Update chapter details
app.post('/subjects/:subjectId/chapters/:chapterId/update', async (req, res) => {
  const { subjectId, chapterId } = req.params;
  const { status, revisions, testDone } = req.body;

  const subject = await Subject.findById(subjectId);
  const chapter = subject.chapters.id(chapterId);

  // Validate and update fields
  chapter.status = status;
  chapter.revisions = isNaN(revisions) || revisions === "" ? 0 : parseInt(revisions, 10);
  chapter.testDone = testDone === "true";

  await subject.save();
  res.redirect(`/subjects/${subjectId}`);
});
// Generate daily timetable (GET request)
app.get('/timetable', async (req, res) => {
  const subjects = await Subject.find({});
  res.render('timetable', { subjects, dailyTasks: [] });  // Pass empty array initially
});

// Custom daily timetable (POST request)
app.post('/timetable', async (req, res) => {
  const subjects = await Subject.find({});
  const timePerDay = parseInt(req.body.timePerDay);
  const totalTopics = [];
  
  // Collect all topics
  subjects.forEach(subject => {
      subject.chapters.forEach(chapter => {
          totalTopics.push({
              title: chapter.title,
              difficulty: chapter.difficulty,
          });
      });
  });

  // Sort topics by difficulty: Hard > Medium > Easy
  totalTopics.sort((a, b) => {
      const difficultyOrder = { Hard: 3, Medium: 2, Easy: 1 };
      return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
  });

  // Calculate number of topics to study per day
  const numberOfTopics = totalTopics.length;
  const topicsPerDay = Math.ceil(numberOfTopics / (timePerDay / 2));

  const dailyTasks = [];
  for (let i = 0; i < numberOfTopics; i += topicsPerDay) {
      dailyTasks.push(totalTopics.slice(i, i + topicsPerDay));
  }

  res.render('timetable', { dailyTasks, subjects });
});


// View tasks
app.get('/tasks', async (req, res) => {
  const dailyTasks = await Task.find({ type: 'daily' });
  const weeklyTasks = await Task.find({ type: 'weekly' });
  res.render('tasks', { dailyTasks, weeklyTasks });
});

// Add a new task
app.post('/tasks/add', async (req, res) => {
  const { title, description, type } = req.body;
  const newTask = new Task({ title, description, type });
  await newTask.save();
  res.redirect('/tasks');
});

// Update task completion status
app.post('/tasks/:id/toggle', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.redirect('/tasks');
});

// Delete a task
app.post('/tasks/:id/delete', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/tasks');
});

// Performance analytics route
app.get('/analytics', async (req, res) => {
  const subjects = await Subject.find({});
  let totalTopics = 0;
  let completedTopics = 0;
  let timeSpentData = {};

  // Calculate total and completed topics
  subjects.forEach(subject => {
      subject.chapters.forEach(chapter => {
          totalTopics++;
          if (chapter.status === 'Completed') completedTopics++;
      });

      // Initialize time spent data for each subject
      if (!timeSpentData[subject.name]) {
          timeSpentData[subject.name] = Math.floor(Math.random() * 10); // Mock time data
      }
  });

  const completionPercentage = ((completedTopics / totalTopics) * 100).toFixed(2);

  res.render('analytics', {
      subjects,
      totalTopics,
      completedTopics,
      completionPercentage,
      timeSpentData,
  });
});


app.listen(PORT, () => {
    console.log('Server started on http://localhost:3000');
});
