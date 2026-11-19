// ===================================
// وظيفة النطق
// ===================================

function speakWord(text, speed) {

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "de-DE";
    speech.rate = speed;

    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
}

window.speakWord = speakWord;


// ===================================
// عناصر التطبيق
// ===================================

const dictionaryBtn = document.getElementById("dictionaryBtn");
const quizBtn = document.getElementById("quizBtn");

const dictionary = document.getElementById("dictionary");
const quiz = document.getElementById("quiz");

const menu = document.querySelector(".menu");

const backBtn = document.getElementById("backBtn");
const quizBackBtn = document.getElementById("quizBackBtn");

const searchWord = document.getElementById("searchWord");
const wordsList = document.getElementById("wordsList");

const levelsContainer = document.getElementById("levels");
const questionArea = document.getElementById("questionArea");

const nextQuestionBtn = document.getElementById("nextQuestionBtn");


// ===================================
// فتح قاموس الكلمات
// ===================================

dictionaryBtn.onclick = function () {

    menu.style.display = "none";

    quiz.style.display = "none";

    dictionary.style.display = "block";

    searchWord.value = "";

    displayWords(words);
};


// ===================================
// العودة للرئيسية من القاموس
// ===================================

backBtn.onclick = function () {

    dictionary.style.display = "none";

    menu.style.display = "grid";

    searchWord.value = "";
};


// ===================================
// بيانات الاختبار
// ===================================

let currentQuestions = [];

let currentQuestionIndex = 0;

let correctAnswers = 0;

let currentLevel = 0;


// ===================================
// المستويات المفتوحة
// ===================================

let unlockedLevel =
    Number(localStorage.getItem("unlockedLevel")) || 1;


// إنشاء المستويات

function createLevels() {

    levelsContainer.innerHTML = "";

    for (let i = 1; i <= 48; i++) {

        const levelBtn = document.createElement("button");

        levelBtn.className = "levelBtn";

        levelBtn.dataset.level = i;

        if (i <= unlockedLevel) {

            levelBtn.textContent = "المستوى " + i + " 🔓";

        } else {

            levelBtn.textContent = "المستوى " + i + " 🔒";

            levelBtn.disabled = true;
        }

        levelsContainer.appendChild(levelBtn);
    }
}

createLevels();


// ===================================
// فتح صفحة اختبر نفسك
// ===================================

quizBtn.onclick = function () {

    menu.style.display = "none";

    dictionary.style.display = "none";

    quiz.style.display = "block";

    levelsContainer.style.display = "block";

    questionArea.style.display = "none";
};


// ===================================
// العودة للرئيسية من الاختبار
// ===================================

quizBackBtn.onclick = function () {

    quiz.style.display = "none";

    menu.style.display = "grid";

    levelsContainer.style.display = "block";

    questionArea.style.display = "none";

    currentQuestions = [];

    currentQuestionIndex = 0;

    correctAnswers = 0;

    currentLevel = 0;
};


// ===================================
// عرض الكلمات في القاموس
// ===================================

function displayWords(list) {

    wordsList.innerHTML = "";

    if (list.length === 0) {

        wordsList.textContent = "لا توجد كلمات مطابقة.";

        return;
    }

    list.forEach(function (word) {

        const card = document.createElement("div");

        card.style.cssText =
            "background:white; padding:15px; margin:10px 0;" +
            "border-radius:12px; border:1px solid #dce5ef;" +
            "text-align:right;";

        // رقم الكلمة

        const number = document.createElement("span");

        number.textContent = word.id;

        number.style.cssText =
            "background:#173b63; color:white; padding:6px 12px;" +
            "border-radius:8px; margin-left:10px; font-weight:bold;";

        card.appendChild(number);


        // الكلمة الألمانية

        const german = document.createElement("h3");

        german.textContent = word.de;

        german.style.color = "#173b63";


        // زر النطق العادي

        const normalSpeakBtn = document.createElement("button");

        normalSpeakBtn.textContent = "🔊 نطق عادي";

        normalSpeakBtn.onclick = function () {

            speakWord(word.de, 1);
        };


        // زر النطق البطيء

        const slowSpeakBtn = document.createElement("button");

        slowSpeakBtn.textContent = "🐢 نطق بطيء";

        slowSpeakBtn.onclick = function () {

            speakWord(word.de, 0.4);
        };


        // المعنى العربي

        const arabic = document.createElement("p");

        arabic.textContent = "المعنى: " + word.ar;


        // الجمع

        const plural = document.createElement("p");

        plural.textContent = "الجمع: " + word.pl;


        // الوحدة

        const unit = document.createElement("small");

        unit.textContent = "الوحدة: " + word.unit;


        // إضافة العناصر للكارت

        card.appendChild(normalSpeakBtn);

        card.appendChild(slowSpeakBtn);

        card.appendChild(german);

        card.appendChild(arabic);

        card.appendChild(plural);

        card.appendChild(unit);

        wordsList.appendChild(card);
    });
}


// ===================================
// البحث عن كلمة
// ===================================

searchWord.addEventListener("input", function () {

    const search = searchWord.value.trim().toLowerCase();

    const results = words.filter(function (word) {

        return word.de.toLowerCase().includes(search) ||

            word.ar.includes(search) ||

            word.pl.toLowerCase().includes(search);
    });

    displayWords(results);
});


// ===================================
// خلط ترتيب العناصر عشوائياً
// ===================================

function shuffleArray(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


// ===================================
// الضغط على أحد المستويات
// ===================================

levelsContainer.addEventListener("click", function (event) {

    const button = event.target.closest(".levelBtn");

    if (!button || button.disabled) return;

    currentLevel = Number(button.dataset.level);


    // تحديد كلمات المستوى

    const start = (currentLevel - 1) * 15;

    const levelWords = words.slice(start, start + 15);

    currentQuestions = shuffleArray(levelWords);


    currentQuestionIndex = 0;

    correctAnswers = 0;


    // إظهار الأسئلة وإخفاء المستويات

    levelsContainer.style.display = "none";

    questionArea.style.display = "block";

    showQuestion();
});


// ===================================
// عرض السؤال
// ===================================

function showQuestion() {

    const question = currentQuestions[currentQuestionIndex];

    document.getElementById("questionNumber").textContent =

        "السؤال " + (currentQuestionIndex + 1) +
        " من " + currentQuestions.length;


    // الكلمة الألمانية وزرا النطق

    const questionWord = document.getElementById("questionWord");

    questionWord.innerHTML = "";


    const germanText = document.createElement("span");

    germanText.textContent = question.de;


    // زر النطق العادي

    const normalBtn = document.createElement("button");

    normalBtn.className = "soundBtn normalSound";

    normalBtn.textContent = "▶";

    normalBtn.title = "نطق عادي";

    normalBtn.onclick = function () {

        speakWord(question.de, 1);
    };


    // زر النطق البطيء

    const slowBtn = document.createElement("button");

    slowBtn.className = "soundBtn slowSound";

    slowBtn.textContent = "🐢";

    slowBtn.title = "نطق بطيء";

    slowBtn.onclick = function () {

        speakWord(question.de, 0.4);
    };


    questionWord.appendChild(germanText);

    questionWord.appendChild(normalBtn);

    questionWord.appendChild(slowBtn);


    // تجهيز الإجابات

    const answersContainer = document.getElementById("answers");

    answersContainer.innerHTML = "";


    document.getElementById("feedback").textContent = "";

    nextQuestionBtn.style.display = "none";


    // تجهيز 3 إجابات خاطئة

    const wrongAnswers = shuffleArray(

        words.filter(function (word) {

            return word.id !== question.id;

        })

    ).slice(0, 3);


    // جمع الإجابات وخلطها

    const choices = shuffleArray([

        question,

        ...wrongAnswers

    ]);


    // إنشاء أزرار الاختيارات

    choices.forEach(function (choice) {

        const answerBtn = document.createElement("button");

        answerBtn.className = "answerBtn";

        answerBtn.textContent = choice.ar;

        answerBtn.onclick = function () {

            checkAnswer(choice, question);
        };

        answersContainer.appendChild(answerBtn);
    });
}


// ===================================
// فحص الإجابة
// ===================================

function checkAnswer(choice, question) {

    const feedback = document.getElementById("feedback");

    const answerButtons = document.querySelectorAll(".answerBtn");


    // منع تغيير الإجابة بعد الاختيار

    answerButtons.forEach(function (btn) {

        btn.disabled = true;
    });


    if (choice.id === question.id) {

        feedback.textContent = "✅ إجابتك صحيحة!";

        feedback.style.color = "green";

        correctAnswers++;

    } else {

        feedback.textContent =

            "❌ إجابتك خطأ، التصحيح هو: " + question.ar;

        feedback.style.color = "red";
    }


    // إظهار زر السؤال التالي

    nextQuestionBtn.style.display = "block";


    if (currentQuestionIndex === currentQuestions.length - 1) {

        nextQuestionBtn.textContent = "عرض النتيجة";

    } else {

        nextQuestionBtn.textContent = "السؤال التالي";
    }
}


// ===================================
// الانتقال للسؤال التالي
// ===================================

nextQuestionBtn.onclick = function () {

    currentQuestionIndex++;


    if (currentQuestionIndex < currentQuestions.length) {

        showQuestion();

    } else {

        finishLevel();
    }
};


// ===================================
// نهاية المستوى وعرض النتيجة
// ===================================

function finishLevel() {

    const totalQuestions = currentQuestions.length;


    // نسبة النجاح 80%

    const passingScore = Math.ceil(totalQuestions * 0.8);

    const passed = correctAnswers >= passingScore;


    // إخفاء الأسئلة وإظهار المستويات

    questionArea.style.display = "none";

    levelsContainer.style.display = "block";


    if (passed) {

        // فتح المستوى التالي


    if (passed && currentLevel >= unlockedLevel && currentLevel < 48) {

            unlockedLevel = currentLevel + 1;
        
            localStorage.setItem("unlockedLevel", unlockedLevel);
        }

        alert(

            "🎉 مبروك! نجحت في المستوى " + currentLevel +

            "\nإجابات صحيحة: " + correctAnswers +

            " من " + totalQuestions +

            "\nتم اجتياز المستوى بنجاح!"
        );

    } else {

        alert(

            "حاول مرة أخرى!\n" +

            "إجابات صحيحة: " + correctAnswers +

            " من " + totalQuestions +

            "\nتحتاج إلى " + passingScore +

            " إجابات صحيحة للنجاح."
        );
    }


    // تحديث أزرار المستويات

    createLevels();
}
// زر الرجوع لأعلى الصفحة
const scrollTopBtn = document.getElementById("scrollTopBtn");

// إظهار الزر عند النزول
window.addEventListener("scroll", function () {
    scrollTopBtn.style.display =
        document.documentElement.scrollTop > 300 ? "block" : "none";
});

// الرجوع لأعلى
scrollTopBtn.onclick = function () {
    window.scrollTo(0, 0);
};