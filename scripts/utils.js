import { POKEAPI_BASE_URL } from './config.js';

// DOM element cache
let elements = {};

/**
 * Caches and returns all DOM elements used in the application
 * @returns {Object} Object containing all cached DOM elements
 */
export function cacheElements() {
    elements = {
        // App containers
        app: document.getElementById('app'),
        loadingOverlay: document.getElementById('loading-overlay'),
        
        // Header elements
        cgpaValue: document.getElementById('cgpa-value'),
        cgpaBar: document.getElementById('cgpa-bar'),
        
        // Semester tracking
        semesterTracker: document.getElementById('semester-tracker'),
        typeMasteryContainer: document.getElementById('type-mastery-container'),
        
        // Growth analysis
        growthAnalysisContainer: document.getElementById('growth-analysis-container'),
        codingSubjectSelect: document.getElementById('coding-subject-select'),
        
        // Training team
        pokemonTeam: document.getElementById('pokemon-team'),
        trainingLogs: document.getElementById('training-logs'),
        
        // Course management
        addCourseBtn: document.getElementById('add-course-btn'),
        courseName: document.getElementById('course-name'),
        courseCode: document.getElementById('course-code'),
        semesterSelect: document.getElementById('semester-select'),
        gradeSelect: document.getElementById('grade-select'),
        courseCredits: document.getElementById('course-credits'),
        
        // Performance analysis
        performanceGraph: document.getElementById('performance-graph'),
        analyzeBtn: document.getElementById('analyze-btn'),
        semesterPerformanceOverview: document.getElementById('semester-performance-overview'),
        
        // Settings
        saveSettingsBtn: document.getElementById('save-settings-btn'),
        studentName: document.getElementById('student-name'),
        enrollmentNo: document.getElementById('enrollment-no'),
        specialization: document.getElementById('specialization'),
        
        // Sync button
        syncBtn: document.getElementById('sync-btn')
    };
    
    return elements;
}

/**
 * Fetches a random Pokémon from PokeAPI
 * @returns {Promise<Object>} Pokémon data object
 */
export async function getRandomPokemon() {
    try {
        const randomId = Math.floor(Math.random() * 898) + 1; // Gen 1-8 Pokémon
        const response = await fetch(`${POKEAPI_BASE_URL}${randomId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const types = data.types.map(t => t.type.name).join('/');
        
        return {
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            image: data.sprites.front_default || 
                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
            types: types.charAt(0).toUpperCase() + types.slice(1),
            height: data.height / 10, // Convert to meters
            weight: data.weight / 10  // Convert to kilograms
        };
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        return getFallbackPokemon();
    }
}

/**
 * Provides fallback Pokémon data when API fails
 * @returns {Object} Fallback Pokémon data
 */
function getFallbackPokemon() {
    const fallbackPokemon = [
        {
            id: 0,
            name: "Missingno",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png",
            types: "Glitch",
            height: 3.0,
            weight: 159.0
        },
        {
            id: 25,
            name: "Pikachu",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
            types: "Electric",
            height: 0.4,
            weight: 6.0
        }
    ];
    
    return fallbackPokemon[Math.floor(Math.random() * fallbackPokemon.length)];
}

/**
 * Calculates CGPA based on student data
 * @param {Object} studentData - Student data object
 * @returns {string} Formatted CGPA (2 decimal places)
 */
export function calculateCGPA(studentData) {
    if (!studentData || studentData.totalCreditsAttempted === 0) {
        return '0.00';
    }
    
    const cgpa = studentData.totalGradePoints / studentData.totalCreditsAttempted;
    return cgpa.toFixed(2);
}

/**
 * Creates a Pokémon card HTML element
 * @param {Object} pokemon - Pokémon data
 * @param {boolean} [interactive=true] - Whether the card should be interactive
 * @returns {string} HTML string for the Pokémon card
 */
export function createPokemonCard(pokemon, interactive = true) {
    return `
        <div class="pokemon-card bg-white rounded-lg p-4 text-center border-2 border-blue-400 shadow-md 
            ${interactive ? 'hover:shadow-lg transform hover:-translate-y-1 transition-all' : ''}">
            <img src="${pokemon.image}" alt="${pokemon.name}" 
                class="mx-auto mb-2 w-24 h-24 object-contain" loading="lazy" />
            <p class="font-bold text-lg text-blue-700">${pokemon.name}</p>
            <p class="text-sm text-gray-600">Type: ${pokemon.types}</p>
            <div class="mt-2 text-xs text-gray-500">
                <span class="inline-block mr-2">HT: ${pokemon.height}m</span>
                <span class="inline-block">WT: ${pokemon.weight}kg</span>
            </div>
        </div>
    `;
}

/**
 * Creates a mystery egg card HTML element
 * @returns {string} HTML string for the mystery egg card
 */
export function createMysteryEggCard() {
    return `
        <div class="pokemon-card bg-gray-100 rounded-lg p-4 text-center border-2 border-gray-300 
            hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png" 
                alt="Mystery Egg" class="mx-auto mb-2 w-20 h-20 filter grayscale" loading="lazy" />
            <p class="font-medium text-lg text-gray-500">Mystery Egg</p>
            <p class="text-xs text-gray-500">Train more to hatch!</p>
        </div>
    `;
}

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} [type='info'] - Type of notification ('info', 'success', 'error')
 * @param {number} [duration=3000] - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Formats a date object for display
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Debounces a function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Calculates completion percentage for a semester
 * @param {Object} semester - Semester data
 * @returns {number} Completion percentage (0-100)
 */
export function calculateSemesterCompletion(semester) {
    if (!semester || semester.totalCredits === 0) return 0;
    return (semester.creditsCompleted / semester.totalCredits) * 100;
}