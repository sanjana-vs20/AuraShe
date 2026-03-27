/**
 * Calculate current pregnancy week from Last Menstrual Period (LMP) date.
 * @param {string} lmpDate - ISO date string e.g. "2024-10-01"
 * @returns {{ week: number, days: number, trimester: number, dueDate: string }}
 */
export function calcPregnancyWeek(lmpDate) {
  const lmp = new Date(lmpDate);
  const today = new Date();
  const totalDays = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
  const week = Math.min(Math.max(Math.floor(totalDays / 7), 1), 40);
  const days = totalDays % 7;

  // Due date = LMP + 280 days (40 weeks)
  const due = new Date(lmp);
  due.setDate(due.getDate() + 280);
  const dueDate = due.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const trimester = week <= 13 ? 1 : week <= 26 ? 2 : 3;
  return { week, days, trimester, dueDate };
}

/**
 * Returns baby development data for the given pregnancy week.
 */
export function getBabyData(week) {
  const milestones = [
    {
      range: [1, 4],
      size: "Poppy seed", sizeEmoji: "🌱",
      babyDesc: "The fertilized egg implants in the uterus. The neural tube — which becomes the brain and spinal cord — begins to form.",
      motherDesc: "You may notice light spotting (implantation bleeding). Fatigue and breast tenderness are common early signs.",
      tips: ["Start taking folic acid (400–800 mcg daily)", "Avoid alcohol, smoking, and raw foods", "Schedule your first prenatal appointment"],
    },
    {
      range: [5, 8],
      size: "Blueberry", sizeEmoji: "🫐",
      babyDesc: "The heart begins beating! Tiny arm and leg buds appear. Facial features like eyes and nostrils start forming.",
      motherDesc: "Morning sickness may peak. Your uterus is growing and you might feel bloated or need to urinate more frequently.",
      tips: ["Eat small, frequent meals to manage nausea", "Stay hydrated — aim for 8–10 glasses of water", "Get plenty of rest and sleep on your side"],
    },
    {
      range: [9, 12],
      size: "Lime", sizeEmoji: "🍋",
      babyDesc: "All vital organs are formed. Baby can make tiny movements. Fingers and toes are fully separated.",
      motherDesc: "The risk of miscarriage drops significantly. You may start to show a small bump. Energy levels often improve.",
      tips: ["First trimester screening (nuchal translucency scan)", "Continue prenatal vitamins with iron and calcium", "Light exercise like walking or prenatal yoga is great"],
    },
    {
      range: [13, 16],
      size: "Avocado", sizeEmoji: "🥑",
      babyDesc: "Baby can suck their thumb and make facial expressions. Bones are hardening and fine hair (lanugo) covers the body.",
      motherDesc: "Welcome to the second trimester! Energy returns for most moms. Your bump is becoming more visible.",
      tips: ["Consider announcing your pregnancy", "Start thinking about maternity clothes", "Discuss genetic testing options with your doctor"],
    },
    {
      range: [17, 20],
      size: "Banana", sizeEmoji: "🍌",
      babyDesc: "You may feel baby's first kicks (quickening)! Baby can hear sounds and responds to your voice.",
      motherDesc: "Your belly is growing noticeably. You might experience back pain, leg cramps, or round ligament pain.",
      tips: ["Anatomy scan (20-week ultrasound) — don't miss it!", "Sleep on your left side to improve circulation", "Start doing pelvic floor (Kegel) exercises"],
    },
    {
      range: [21, 24],
      size: "Corn", sizeEmoji: "🌽",
      babyDesc: "Baby's face is fully formed with eyebrows and eyelashes. Rapid brain development is occurring.",
      motherDesc: "Stretch marks may appear. You might feel Braxton Hicks contractions (practice contractions).",
      tips: ["Apply moisturizer to prevent stretch marks", "Take a childbirth education class", "Discuss birth plan options with your midwife"],
    },
    {
      range: [25, 28],
      size: "Eggplant", sizeEmoji: "🍆",
      babyDesc: "Baby opens their eyes for the first time! Lungs are developing rapidly. Baby can recognize your voice.",
      motherDesc: "Third trimester is near. Heartburn and shortness of breath are common. Sleep may become more difficult.",
      tips: ["Glucose screening test for gestational diabetes", "Start counting baby kicks daily", "Tour your birth hospital or birthing center"],
    },
    {
      range: [29, 32],
      size: "Butternut squash", sizeEmoji: "🎃",
      babyDesc: "Baby is gaining weight rapidly — about half a pound per week. Brain is developing billions of neurons.",
      motherDesc: "You may feel very tired again. Swelling in feet and ankles is normal. Frequent urination returns.",
      tips: ["Pack your hospital bag", "Discuss pain management options for labor", "Reduce sodium intake to manage swelling"],
    },
    {
      range: [33, 36],
      size: "Pineapple", sizeEmoji: "🍍",
      babyDesc: "Baby is getting into position for birth. Lungs are nearly mature. Baby is practicing breathing movements.",
      motherDesc: "Braxton Hicks contractions increase. You may feel pressure in your pelvis as baby drops lower.",
      tips: ["Weekly prenatal visits begin", "Finalize your birth plan", "Install the car seat and prepare the nursery"],
    },
    {
      range: [37, 40],
      size: "Watermelon", sizeEmoji: "🍉",
      babyDesc: "Baby is full term! All organs are ready. Baby is gaining final fat stores and preparing for birth.",
      motherDesc: "You're almost there! Watch for signs of labor: regular contractions, water breaking, or bloody show.",
      tips: ["Know the signs of labor vs. Braxton Hicks", "Rest as much as possible", "Stay in close contact with your healthcare provider"],
    },
  ];

  return (
    milestones.find((m) => week >= m.range[0] && week <= m.range[1]) ||
    milestones[milestones.length - 1]
  );
}

/** Trimester-based nutrition data */
export function getNutritionData(trimester) {
  const data = {
    1: {
      label: "First Trimester", color: "#FF9A5C",
      eat: ["Leafy greens (spinach, kale)", "Fortified cereals & whole grains", "Citrus fruits for Vitamin C", "Lean proteins (chicken, eggs, lentils)", "Dairy or fortified plant milk"],
      avoid: ["Raw or undercooked meat/fish", "High-mercury fish (shark, swordfish)", "Unpasteurized cheeses", "Alcohol & caffeine (limit to <200mg)", "Deli meats unless heated"],
      hydration: "Aim for 8–10 glasses (2L) of water daily. Herbal teas like ginger can help with nausea.",
    },
    2: {
      label: "Second Trimester", color: "#C850C0",
      eat: ["Iron-rich foods (red meat, beans, tofu)", "Calcium sources (dairy, broccoli, almonds)", "Omega-3 fatty acids (salmon, walnuts, flaxseed)", "Complex carbs for sustained energy", "Vitamin D sources (eggs, fortified milk)"],
      avoid: ["Excess sugar and processed foods", "Raw sprouts", "Unpasteurized juices", "High-sodium snacks", "Licorice root"],
      hydration: "Increase to 10 glasses (2.3L) daily. Add electrolytes if experiencing leg cramps.",
    },
    3: {
      label: "Third Trimester", color: "#6C63FF",
      eat: ["Protein-rich foods for baby's growth", "Fiber-rich foods to prevent constipation", "Magnesium sources (nuts, seeds, dark chocolate)", "Vitamin K (leafy greens) for blood clotting", "Small frequent meals to manage heartburn"],
      avoid: ["Spicy foods if experiencing heartburn", "Carbonated drinks", "Large meals before bedtime", "Excess salt (worsens swelling)", "Herbal supplements without doctor approval"],
      hydration: "10–12 glasses (2.5L) daily. Coconut water is great for hydration and electrolytes.",
    },
  };
  return data[trimester] || data[1];
}

/** Warning signs that need immediate medical attention */
export const WARNING_SIGNS = [
  { icon: "🩸", title: "Heavy Bleeding", desc: "Any heavy vaginal bleeding — seek emergency care immediately.", severity: "critical" },
  { icon: "💢", title: "Severe Abdominal Pain", desc: "Intense cramping or pain in the abdomen not relieved by rest.", severity: "critical" },
  { icon: "👁️", title: "Vision Changes", desc: "Blurred vision, seeing spots, or sudden vision loss.", severity: "high" },
  { icon: "🤕", title: "Severe Headache", desc: "Persistent, severe headache that doesn't go away with rest.", severity: "high" },
  { icon: "🦵", title: "Leg Swelling + Pain", desc: "Sudden swelling in one leg with pain could indicate a blood clot.", severity: "high" },
  { icon: "🫁", title: "Difficulty Breathing", desc: "Sudden shortness of breath or chest pain.", severity: "critical" },
  { icon: "🌡️", title: "High Fever", desc: "Temperature above 38°C (100.4°F) — contact your doctor.", severity: "high" },
  { icon: "👶", title: "Reduced Baby Movement", desc: "Fewer than 10 kicks in 2 hours after week 28.", severity: "high" },
];

/** Default reminder templates */
export const DEFAULT_REMINDERS = [
  { id: 1, icon: "💊", title: "Prenatal Vitamins", time: "08:00", days: "Daily", active: true },
  { id: 2, icon: "💧", title: "Water Intake", time: "Every 2 hrs", days: "Daily", active: true },
  { id: 3, icon: "🏥", title: "Doctor Appointment", time: "10:00", days: "As scheduled", active: false },
  { id: 4, icon: "🧘", title: "Prenatal Yoga", time: "07:00", days: "Mon, Wed, Fri", active: true },
  { id: 5, icon: "🩺", title: "Blood Pressure Check", time: "09:00", days: "Weekly", active: false },
];

/** AI chatbot FAQ responses */
export const CHAT_FAQ = [
  { q: "Is it safe to exercise?", a: "Light exercise like walking, swimming, and prenatal yoga is generally safe and beneficial. Always consult your doctor before starting any new exercise routine." },
  { q: "What foods should I avoid?", a: "Avoid raw/undercooked meat, high-mercury fish, unpasteurized dairy, alcohol, and limit caffeine to under 200mg daily." },
  { q: "How much weight should I gain?", a: "It depends on your pre-pregnancy BMI. Generally 11–16 kg for normal BMI. Your doctor will guide you based on your specific situation." },
  { q: "Is spotting normal?", a: "Light spotting in early pregnancy can be normal (implantation bleeding). However, heavy bleeding is not normal — contact your doctor immediately." },
  { q: "When do I feel baby kick?", a: "Most women feel first movements (quickening) between weeks 16–25. First-time moms may feel it later, around week 20–25." },
  { q: "Can I travel during pregnancy?", a: "Travel is generally safe in the second trimester. Avoid long trips in the third trimester. Always consult your doctor and check airline policies." },
  { q: "What are Braxton Hicks?", a: "Braxton Hicks are practice contractions — irregular, painless tightening of the uterus. They're normal and different from real labor contractions." },
  { q: "How do I manage morning sickness?", a: "Eat small frequent meals, avoid strong smells, try ginger tea or crackers, stay hydrated, and rest. If severe, consult your doctor about medication." },
];
