import { db, auth } from './firebase.js';
import { cseSyllabus, gradePoints, defaultStudentData } from './syllabus.js';
import { cacheElements, getRandomPokemon, calculateCGPA } from './utils.js';
import { TOTAL_SEMESTERS, POKEAPI_BASE_URL } from './config.js';

class PokemonTrackerApp {
    constructor() {
        this.elements = cacheElements();
        this.studentData = { ...defaultStudentData };
        this.init();
    }

    async init() {
        try {
            // Initialize the app
            await this.loadStudentData();
            this.setupEventListeners();
            this.render();
            
            // Hide loading overlay
            this.elements.loadingOverlay.classList.add('hidden');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showError('Failed to initialize app');
        }
    }

    async loadStudentData() {
        // Try to load from localStorage first
        const savedData = localStorage.getItem('pokemonProgressData');
        if (savedData) {
            this.studentData = JSON.parse(savedData);
        } else {
            // Initialize from syllabus
            this.initializeFromSyllabus();
        }
        this.calculateOverallProgress();
    }

    initializeFromSyllabus() {
        for (let i = 1; i <= TOTAL_SEMESTERS; i++) {
            this.studentData.semesters[i] = {
                courses: [],
                creditsCompleted: 0,
                totalCredits: 0,
                gradePointsEarned: 0,
                overallSemesterGPA: 0,
                completed: false
            };

            if (cseSyllabus[i]) {
                cseSyllabus[i].forEach(syllabusCourse => {
                    this.studentData.semesters[i].courses.push({
                        ...syllabusCourse,
                        completed: false,
                        grade: null,
                        subTopicProgress: syllabusCourse.type === 'Coding' && syllabusCourse.subTopics ? 
                            syllabusCourse.subTopics.map(topic => ({ name: topic, completed: false })) : []
                    });
                    this.studentData.semesters[i].totalCredits += syllabusCourse.credits;
                });
            }
        }
    }

    saveStudentData() {
        localStorage.setItem('pokemonProgressData', JSON.stringify(this.studentData));
        this.render();
    }

    calculateOverallProgress() {
        let overallTotalCreditsEarned = 0;
        let overallTotalGradePoints = 0;
        let overallTotalCreditsAttempted = 0;

        for (const sem in this.studentData.semesters) {
            let semesterCreditsCompleted = 0;
            let semesterGradePointsEarned = 0;
            let semesterCreditsAttempted = 0;

            this.studentData.semesters[sem].courses.forEach(course => {
                semesterCreditsAttempted += course.credits;
                overallTotalCreditsAttempted += course.credits;

                if (course.completed) {
                    semesterCreditsCompleted += course.credits;
                    overallTotalCreditsEarned += course.credits;
                }
                
                if (course.grade && gradePoints[course.grade] !== undefined) {
                    const points = gradePoints[course.grade];
                    semesterGradePointsEarned += (points * course.credits);
                    overallTotalGradePoints += (points * course.credits);
                }
            });

            this.studentData.semesters[sem].creditsCompleted = semesterCreditsCompleted;
            this.studentData.semesters[sem].gradePointsEarned = semesterGradePointsEarned;
            this.studentData.semesters[sem].completed = 
                semesterCreditsCompleted === this.studentData.semesters[sem].totalCredits && 
                semesterCreditsCompleted > 0;
            this.studentData.semesters[sem].overallSemesterGPA = 
                semesterCreditsAttempted > 0 ? 
                (semesterGradePointsEarned / semesterCreditsAttempted).toFixed(2) : '0.00';
        }

        this.studentData.totalCreditsEarned = overallTotalCreditsEarned;
        this.studentData.totalGradePoints = overallTotalGradePoints;
        this.studentData.totalCreditsAttempted = overallTotalCreditsAttempted;
    }

    render() {
        this.renderSemesterBadges();
        this.renderPokemonTeam();
        this.updateCGPA();
        this.renderTypeMastery();
        this.renderTrainingLogs();
        this.populateCodingSubjectSelect();
    }

    renderSemesterBadges() {
        let html = '';
        for (let i = 1; i <= TOTAL_SEMESTERS; i++) {
            const semester = this.studentData.semesters[i];
            const isCompleted = semester && semester.completed;
            const completionPercentage = semester && semester.totalCredits > 0 ? 
                (semester.creditsCompleted / semester.totalCredits) * 100 : 0;

            html += `
                <div class="pokemon-card bg-gray-100 rounded-lg p-4 text-center border-2 ${isCompleted ? 'border-green-500' : 'border-gray-300'}">
                    <img src="${isCompleted ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/empty-ball.png'}"
                        alt="Semester ${i} Badge" class="mx-auto mb-2 w-16 h-16" />
                    <h4 class="font-medium">Semester ${i}</h4>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div class="bg-blue-500 h-2 rounded-full progress-bar" style="width: ${completionPercentage}%"></div>
                    </div>
                    <p class="text-xs mt-1">${completionPercentage.toFixed(0)}% Complete</p>
                </div>
            `;
        }
        this.elements.semesterTracker.innerHTML = html;
    }

    async renderPokemonTeam() {
        const teamSize = 6;
        const totalPossibleCredits = this.getTotalPossibleCredits();
        const progressRatio = totalPossibleCredits > 0 ? 
            this.studentData.totalCreditsEarned / totalPossibleCredits : 0;
        
        let html = '';
        const pokemonToShow = Math.min(teamSize, Math.max(1, Math.floor(teamSize * progressRatio)));
        
        try {
            // Show actual Pokémon for completed progress
            for (let i = 0; i < pokemonToShow; i++) {
                const pokemon = await getRandomPokemon();
                html += `
                    <div class="pokemon-card bg-white rounded-lg p-4 text-center border-2 border-blue-400 shadow-md">
                        <img src="${pokemon.image}" alt="${pokemon.name}" class="mx-auto mb-2 w-24 h-24" />
                        <p class="font-bold text-lg text-blue-700">${pokemon.name}</p>
                        <p class="text-sm text-gray-600">Type: ${pokemon.types}</p>
                        <p class="text-xs text-green-500">Battle Ready!</p>
                    </div>
                `;
            }
            
            // Show mystery eggs for remaining slots
            for (let i = pokemonToShow; i < teamSize; i++) {
                html += `
                    <div class="pokemon-card bg-gray-100 rounded-lg p-4 text-center border-2 border-gray-300">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png" 
                             alt="Mystery Pokemon" class="mx-auto mb-2 w-20 h-20 filter grayscale" />
                        <p class="font-medium text-lg text-gray-500">Mystery Egg</p>
                        <p class="text-xs text-gray-500">Train more to hatch!</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error rendering Pokémon team:', error);
            html = `
                <div class="pokemon-card bg-gray-100 rounded-lg p-4 text-center col-span-2">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" 
                         alt="Master Ball" class="mx-auto mb-2 w-20 h-20" />
                    <p class="font-medium text-lg">Pokédex Error</p>
                    <p class="text-xs text-gray-500">Could not load Pokémon data</p>
                </div>
            `;
        }
        
        this.elements.pokemonTeam.innerHTML = html;
    }

    getTotalPossibleCredits() {
        return Object.values(cseSyllabus).flat()
            .reduce((sum, course) => sum + course.credits, 0);
    }

    updateCGPA() {
        const cgpa = calculateCGPA(this.studentData);
        this.elements.cgpaValue.textContent = cgpa;
        const progressPercentage = (cgpa / 10) * 100;
        this.elements.cgpaBar.style.width = `${progressPercentage}%`;
    }

    renderTypeMastery() {
        const types = [
            { name: "Coding", icon: "https://cdn-icons-png.flaticon.com/512/1057/1057864.png", progress: 0 },
            { name: "Math", icon: "https://cdn-icons-png.flaticon.com/512/2928/2928643.png", progress: 0 },
            { name: "Science", icon: "https://cdn-icons-png.flaticon.com/512/2928/2928666.png", progress: 0 },
            { name: "Engineering", icon: "https://cdn-icons-png.flaticon.com/512/2928/2928734.png", progress: 0 },
            { name: "Project", icon: "https://cdn-icons-png.flaticon.com/512/2928/2928678.png", progress: 0 },
            { name: "General", icon: "https://cdn-icons-png.flaticon.com/512/2928/2928704.png", progress: 0 }
        ];

        // Calculate actual progress for each type
        types.forEach(type => {
            let totalCredits = 0;
            let earnedCredits = 0;

            for (const sem in this.studentData.semesters) {
                this.studentData.semesters[sem].courses.forEach(course => {
                    if (course.type === type.name) {
                        totalCredits += course.credits;
                        if (course.completed) {
                            earnedCredits += course.credits;
                        }
                    }
                });
            }

            type.progress = totalCredits > 0 ? (earnedCredits / totalCredits) * 100 : 0;
        });

        this.elements.typeMasteryContainer.innerHTML = types.map(type => `
            <div class="bg-blue-100 rounded-lg p-4 text-center border-2 border-blue-300 pokemon-card">
                <img src="${type.icon}" alt="${type.name} Type Symbol" class="mx-auto mb-2 w-12 h-12" />
                <h4 class="font-medium">${type.name}</h4>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div class="bg-blue-500 h-2 rounded-full progress-bar" style="width: ${type.progress.toFixed(0)}%"></div>
                </div>
                <p class="text-xs mt-1">${type.progress.toFixed(0)}%</p>
            </div>
        `).join('');
    }

    renderTrainingLogs(message = null) {
        if (message) {
            const logEntry = document.createElement('p');
            logEntry.className = 'text-sm text-gray-800 border-b border-gray-100 pb-1 mb-1 last:border-b-0';
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            this.elements.trainingLogs.prepend(logEntry);
            
            while (this.elements.trainingLogs.children.length > 10) {
                this.elements.trainingLogs.removeChild(this.elements.trainingLogs.lastChild);
            }
        } else if (this.elements.trainingLogs.children.length === 0) {
            this.elements.trainingLogs.innerHTML = '<p class="text-sm text-gray-600">Logs will appear here as you complete courses...</p>';
        }
    }

    populateCodingSubjectSelect() {
        this.elements.codingSubjectSelect.innerHTML = '<option value="">Select a Coding Subject for Growth Analysis</option>';
        const codingSubjects = [];

        for (const sem in this.studentData.semesters) {
            this.studentData.semesters[sem].courses.forEach(course => {
                if (course.type === 'Coding' && course.subTopicProgress && course.subTopicProgress.length > 0) {
                    codingSubjects.push({ 
                        name: course.name, 
                        code: course.code, 
                        semester: sem 
                    });
                }
            });
        }

        codingSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = `${subject.semester}-${subject.code}`;
            option.textContent = `Semester ${subject.semester}: ${subject.name} (${subject.code})`;
            this.elements.codingSubjectSelect.appendChild(option);
        });
    }

    displayGrowthAnalysis(semesterCode) {
        const [sem, code] = semesterCode.split('-');
        const semesterNum = parseInt(sem);
        const selectedCourse = this.studentData.semesters[semesterNum]?.courses.find(c => c.code === code);

        if (!selectedCourse || !selectedCourse.subTopicProgress || selectedCourse.subTopicProgress.length === 0) {
            this.elements.growthAnalysisContainer.innerHTML = '<p class="text-gray-500">No sub-topics defined for this subject.</p>';
            return;
        }

        let html = `<h4 class="font-bold text-lg mb-4">${selectedCourse.name} (${selectedCourse.code}) - Growth Analysis</h4>`;
        html += `<ul class="space-y-2">`;

        selectedCourse.subTopicProgress.forEach((topic, index) => {
            html += `
                <li class="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <span class="text-gray-800">${topic.name}</span>
                    <input type="checkbox" data-sem="${semesterNum}" data-code="${code}" data-topic-index="${index}"
                        class="form-checkbox h-5 w-5 text-blue-600 rounded" ${topic.completed ? 'checked' : ''} 
                        onchange="app.toggleSubTopicCompletion(this)">
                </li>
            `;
        });

        const completedTopics = selectedCourse.subTopicProgress.filter(t => t.completed).length;
        const totalTopics = selectedCourse.subTopicProgress.length;
        const topicCompletionPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

        html += `</ul>`;
        html += `<div class="mt-4 text-center">
                    <p class="font-bold text-md mb-2">Overall Topic Completion: ${topicCompletionPercentage.toFixed(0)}%</p>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="bg-indigo-500 h-3 rounded-full progress-bar" style="width: ${topicCompletionPercentage.toFixed(0)}%"></div>
                    </div>
                 </div>`;

        this.elements.growthAnalysisContainer.innerHTML = html;
    }

    toggleSubTopicCompletion(checkbox) {
        const sem = parseInt(checkbox.dataset.sem);
        const code = checkbox.dataset.code;
        const topicIndex = parseInt(checkbox.dataset.topicIndex);

        const course = this.studentData.semesters[sem].courses.find(c => c.code === code);
        if (course && course.subTopicProgress[topicIndex]) {
            course.subTopicProgress[topicIndex].completed = checkbox.checked;
            this.saveStudentData();
            this.renderTrainingLogs(`Topic "${course.subTopicProgress[topicIndex].name}" in ${course.name} marked as ${checkbox.checked ? 'completed' : 'incomplete'}.`);
            
            // Re-render if this course is currently selected
            if (this.elements.codingSubjectSelect.value === `${sem}-${code}`) {
                this.displayGrowthAnalysis(`${sem}-${code}`);
            }
        }
    }

    setupEventListeners() {
        this.elements.addCourseBtn.addEventListener('click', () => this.addNewCourse());
        this.elements.syncBtn.addEventListener('click', () => this.syncWithCloud());
        this.elements.analyzeBtn.addEventListener('click', () => this.displaySemesterPerformance());
        this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.elements.codingSubjectSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.displayGrowthAnalysis(e.target.value);
            } else {
                this.elements.growthAnalysisContainer.innerHTML = '<p class="text-gray-500">Select a coding subject to view sub-topic progress.</p>';
            }
        });

        // Make app instance available globally for HTML event handlers
        window.app = this;
    }

    addNewCourse() {
        const name = this.elements.courseName.value.trim();
        const code = this.elements.courseCode.value.trim().toUpperCase();
        const semester = parseInt(this.elements.semesterSelect.value);
        const grade = this.elements.gradeSelect.value;
        const credits = parseInt(this.elements.courseCredits.value);

        if (!name || !code || isNaN(semester) || !grade || isNaN(credits) || credits <= 0) {
            this.showError('Please fill in all course details correctly.');
            return;
        }

        if (!this.studentData.semesters[semester]) {
            this.studentData.semesters[semester] = { 
                courses: [], 
                creditsCompleted: 0, 
                totalCredits: 0, 
                gradePointsEarned: 0, 
                overallSemesterGPA: 0, 
                completed: false 
            };
        }

        const syllabusCourse = cseSyllabus[semester]?.find(c => c.code === code);
        const existingCourseIndex = this.studentData.semesters[semester].courses.findIndex(c => c.code === code);

        if (existingCourseIndex > -1) {
            this.updateExistingCourse(existingCourseIndex, semester, name, grade, credits, syllabusCourse);
            this.renderTrainingLogs(`Updated grade for ${name} (${code}) to ${grade}.`);
        } else {
            this.addNewCourseToSemester(semester, name, code, grade, credits, syllabusCourse);
            this.renderTrainingLogs(`Captured new course: ${name} (${code}) with grade ${grade}.`);
        }

        this.calculateOverallProgress();
        this.saveStudentData();
        this.clearCourseForm();
    }

    updateExistingCourse(index, semester, name, grade, credits, syllabusCourse) {
        const existingCourse = this.studentData.semesters[semester].courses[index];
        
        // Subtract old values from totals
        if (existingCourse.grade) {
            this.studentData.totalGradePoints -= (gradePoints[existingCourse.grade] * existingCourse.credits);
            this.studentData.totalCreditsAttempted -= existingCourse.credits;
            this.studentData.semesters[semester].gradePointsEarned -= 
                (gradePoints[existingCourse.grade] * existingCourse.credits);
        }
        if (existingCourse.completed) {
            this.studentData.totalCreditsEarned -= existingCourse.credits;
            this.studentData.semesters[semester].creditsCompleted -= existingCourse.credits;
        }

        // Update course data
        existingCourse.name = name;
        existingCourse.grade = grade;
        existingCourse.credits = credits;
        existingCourse.completed = grade !== 'F';
        existingCourse.type = syllabusCourse ? syllabusCourse.type : existingCourse.type || "Unknown";
        
        if (existingCourse.type === 'Coding' && 
            (!existingCourse.subTopicProgress || existingCourse.subTopicProgress.length === 0) && 
            syllabusCourse && syllabusCourse.subTopics) {
            existingCourse.subTopicProgress = syllabusCourse.subTopics.map(topic => ({ 
                name: topic, 
                completed: false 
            }));
        }

        // Add new values to totals
        this.studentData.totalGradePoints += (gradePoints[grade] * credits);
        this.studentData.totalCreditsAttempted += credits;
        this.studentData.semesters[semester].gradePointsEarned += (gradePoints[grade] * credits);
        
        if (grade !== 'F') {
            this.studentData.totalCreditsEarned += credits;
            this.studentData.semesters[semester].creditsCompleted += credits;
        }
    }

    addNewCourseToSemester(semester, name, code, grade, credits, syllabusCourse) {
        const newCourse = {
            name,
            code,
            semester,
            grade,
            credits,
            completed: grade !== 'F',
            type: syllabusCourse ? syllabusCourse.type : "Unknown",
            subTopicProgress: syllabusCourse && syllabusCourse.type === 'Coding' && syllabusCourse.subTopics ?
                syllabusCourse.subTopics.map(topic => ({ name: topic, completed: false })) : []
        };

        this.studentData.semesters[semester].courses.push(newCourse);
        this.studentData.totalGradePoints += (gradePoints[grade] * credits);
        this.studentData.totalCreditsAttempted += credits;
        this.studentData.semesters[semester].gradePointsEarned += (gradePoints[grade] * credits);
        
        if (grade !== 'F') {
            this.studentData.totalCreditsEarned += credits;
            this.studentData.semesters[semester].creditsCompleted += credits;
        }
    }

    clearCourseForm() {
        this.elements.courseName.value = '';
        this.elements.courseCode.value = '';
        this.elements.semesterSelect.value = '1';
        this.elements.gradeSelect.value = 'S';
        this.elements.courseCredits.value = '';
    }

    saveSettings() {
        this.studentData.name = this.elements.studentName.value.trim();
        this.studentData.enrollmentNo = this.elements.enrollmentNo.value.trim();
        this.studentData.specialization = this.elements.specialization.value;
        this.saveStudentData();
        this.renderTrainingLogs(`Trainer settings saved for ${this.studentData.name}.`);
    }

    async syncWithCloud() {
        try {
            this.showLoading('Syncing with PokeCloud...');
            const user = auth.currentUser;
            
            if (user) {
                await db.collection('trainers').doc(user.uid).set(this.studentData);
                this.renderTrainingLogs("PokeCloud sync complete!");
            } else {
                this.showError("Please sign in to sync with PokeCloud");
            }
        } catch (error) {
            console.error("Sync failed:", error);
            this.showError("Sync failed. Please try again.");
        } finally {
            this.hideLoading();
        }
    }

    displaySemesterPerformance() {
        let html = '<h4 class="font-bold text-lg mb-4">Semester-wise Performance</h4>';

        for (let i = 1; i <= TOTAL_SEMESTERS; i++) {
            const semester = this.studentData.semesters[i];
            
            if (semester && semester.totalCredits > 0) {
                html += `
                    <div class="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200 shadow-sm">
                        <h5 class="font-semibold text-blue-800">Semester ${i}</h5>
                        <p class="text-sm">Credits Earned: <span class="font-bold">${semester.creditsCompleted} / ${semester.totalCredits}</span></p>
                        <p class="text-sm">Semester GPA: <span class="font-bold">${semester.overallSemesterGPA}</span></p>
                        <div class="mt-2 text-xs text-gray-700">
                            <strong>Courses:</strong>
                            <ul class="list-disc list-inside ml-2">
                                ${semester.courses.map(course => 
                                    `<li>${course.name} (${course.code}): Grade ${course.grade || 'N/A'}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            } else if (cseSyllabus[i] && cseSyllabus[i].length > 0) {
                html += `
                    <div class="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200 shadow-sm">
                        <h5 class="font-semibold text-gray-700">Semester ${i}</h5>
                        <p class="text-sm text-gray-500">No data available for this semester yet.</p>
                        <div class="mt-2 text-xs text-gray-700">
                            <strong>Planned Courses:</strong>
                            <ul class="list-disc list-inside ml-2">
                                ${cseSyllabus[i].map(course => 
                                    `<li>${course.name} (${course.code}) - ${course.credits} Credits</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }
        }

        this.elements.semesterPerformanceOverview.innerHTML = html;
        this.renderTrainingLogs("Semester performance analysis complete.");
        this.elements.performanceGraph.innerHTML = 
            '<p class="text-gray-500">Performance graph will appear here in future updates.</p>';
    }

    showLoading(message) {
        this.elements.loadingOverlay.querySelector('p').textContent = message;
        this.elements.loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
        
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokemonTrackerApp();
});