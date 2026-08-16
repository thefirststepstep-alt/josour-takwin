// Safe Storage Helper for Incognito & Private Browsing
function safeGetStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function safeSetStorage(key, val) {
    try {
        localStorage.setItem(key, val);
    } catch (e) {
        console.log('Storage note: LocalStorage restricted in Incognito mode');
    }
}

// Default Immutable App State Template
const defaultStateTemplate = {
    docTitle: "ميثاق وآداب نادي جسور",
    subtitle: "دليل الأخلاقيات، الإتيكيت ومتابعة مهارات الأعضاء",
    skills: [
        { id: "s1", name: "قراءة وفهم الميثاق", category: "الأخلاقيات والميثاق" },
        { id: "s2", name: "إتيكيت التعامل والاستقبال", category: "الإتيكيت والسلوك" },
        { id: "s3", name: "رفع وتنسيق المرئيات بالحاسوب", category: "المهارات التقنية" },
        { id: "s4", name: "إدارة الخلاف والحل الودي", category: "الأخلاقيات والميثاق" },
        { id: "s5", name: "إجازة وتكوين الآخرين", category: "التدريب" }
    ],
    members: [
        { id: "m1", name: "آية", role: "مُدرّب رئيسي", trainerId: null },
        { id: "m2", name: "مريم", role: "عضو جديد", trainerId: "m1" },
        { id: "m3", name: "آلاء", role: "عضو عامل", trainerId: "m1" },
        { id: "m4", name: "يسرى", role: "مسؤول لجنة", trainerId: "m1" },
        { id: "m5", name: "أشواق", role: "عضو جديد", trainerId: "m3" }
    ],
    matrix: {
        "m1_s1": "trainer", "m1_s2": "trainer", "m1_s3": "trainer", "m1_s4": "trainer", "m1_s5": "trainer",
        "m2_s1": "completed", "m2_s2": "pending", "m2_s3": "completed", "m2_s4": "not-started", "m2_s5": "not-started",
        "m3_s1": "completed", "m3_s2": "trainer", "m3_s3": "completed", "m3_s4": "completed", "m3_s5": "completed",
        "m4_s1": "completed", "m4_s2": "pending", "m4_s3": "not-started", "m4_s4": "not-started", "m4_s5": "not-started",
        "m5_s1": "pending", "m5_s2": "not-started", "m5_s3": "not-started", "m5_s4": "not-started", "m5_s5": "not-started"
    },
    conductItems: [
        {
            id: "c1",
            title: "الاستقبال والترحيب بأي عضو أو ضيف يطرق باب النادي",
            category: "الإتيكيت العام",
            desc: "على كل عضو متواجد بمقر النادي القيام بالترحيب بالابتسامة، والتعريف بنفسه وبيئة النادي بصورة حسنة.",
            scenario: "موقف: دخل ضيف غريب للنادي والجميع مشغولون. التصرف: يترك أقرب عضو عمله فوراً لمدة دقيقة للترحيب به وإجلاسه."
        },
        {
            id: "c2",
            title: "إتيكيت استخدام الحاسوب ورفع المرئيات",
            category: "استخدام الحاسوب والتقنية",
            desc: "عدم تغيير إعدادات حاسوب النادي، وحفظ الفيديوهات والتصاميم في المجلدات المخصصة بالاسم والتاريخ.",
            scenario: "موقف: إنهاء فيديو لمجلس تكويني. التصرف: رفعه في المجلد المخصص باسم '2026-08_المجلس_التكويني' وإعلام مسؤول الإعلام."
        },
        {
            id: "c3",
            title: "حل الخلافات داخل الأروقة بالرفق والحوار",
            category: "التعامل والأخلاق",
            desc: "يُمنع رفع الصوت أو المشادة أمام الأعضاء الجدد، ويُرفع أي تباين في الآراء لمسؤول اللجنة أو المدرب مباشرة.",
            scenario: "موقف: اختلاف في وجهات النظر حول تنظيم نشاط. التصرف: التوقف عن النقاش الحاد وعقد جلسة مغلقة هادئة."
        }
    ],
    questions: [
        { id: "q1", text: "كيف تتعامل مع ضيف جديد يزور النادي لأول مرة وهو ينتظر مسؤول اللجنة؟", guide: "الترحيب بالابتسامة، إجلاسه، وتقديم الضيافة وإخطار المسؤول هادئاً." },
        { id: "q2", text: "ما هي الخطوات الواجب اتباعها عند حفظ مقطع فيديو تم مونتاجه على حاسوب النادي؟", guide: "حفظه في مجلد التاريخ المناسب باسم واضح وإخبار المسؤول." }
    ],
    submissions: []
};

function getFreshDefaultState() {
    return JSON.parse(JSON.stringify(defaultStateTemplate));
}

function loadInitialAppState() {
    try {
        const saved = safeGetStorage('josour_takwin_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.members && parsed.skills) {
                if (!parsed.questions) parsed.questions = getFreshDefaultState().questions;
                if (!parsed.submissions) parsed.submissions = [];
                return parsed;
            }
        }
    } catch(e) {
        console.log('Load state note:', e);
    }
    return getFreshDefaultState();
}

window.appState = loadInitialAppState();

function saveState() {
    safeSetStorage('josour_takwin_state', JSON.stringify(window.appState));
    if (typeof syncStateToFirebase === 'function') {
        syncStateToFirebase(window.appState);
    }
    renderAll();
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
}

function renderAll() {
    if (!document.getElementById('docTitleDisplay')) return;
    document.getElementById('docTitleDisplay').innerText = window.appState.docTitle;
    document.getElementById('platformSubtitle').innerText = window.appState.subtitle;
    document.getElementById('settingDocTitle').value = window.appState.docTitle;
    document.getElementById('settingSubtitle').value = window.appState.subtitle;

    renderConductGrid();
    renderMatrix();
    renderHierarchicalTree();
    renderProfiles();
    renderExamSection();
    populateTrainerDropdowns();
}

// Conduct cards
function renderConductGrid() {
    const grid = document.getElementById('conductGrid');
    if (!grid) return;
    grid.innerHTML = '';

    window.appState.conductItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'conduct-card';
        card.innerHTML = `
            <span class="conduct-tag">${item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            ${item.scenario ? `
                <div class="scenario-box">
                    <strong><i class="fa-solid fa-lightbulb"></i> سيناريو تطبيقي:</strong>
                    ${item.scenario}
                </div>
            ` : ''}
            <div style="margin-top: 15px; text-align: left;">
                <button class="btn btn-danger btn-sm" onclick="deleteConduct('${item.id}')">
                    <i class="fa-solid fa-trash"></i> حذف
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterConductCards() {
    const q = document.getElementById('conductSearch').value.toLowerCase();
    document.querySelectorAll('.conduct-card').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
    });
}

// Matrix Grid
function renderMatrix() {
    const headerRow = document.getElementById('matrixHeaderRow');
    const tbody = document.getElementById('matrixBody');
    if (!headerRow || !tbody) return;

    let headerHTML = `<th class="member-col"><i class="fa-solid fa-users"></i> اسم العضو والمدرب</th>`;
    window.appState.skills.forEach(skill => {
        headerHTML += `
            <th>
                <div class="skill-header-item">
                    <span>${skill.name}</span>
                    <i class="fa-solid fa-xmark skill-del-btn" title="حذف المهارة" onclick="deleteSkill('${skill.id}')"></i>
                </div>
            </th>
        `;
    });
    headerHTML += `<th>إدارة</th>`;
    headerRow.innerHTML = headerHTML;

    let bodyHTML = '';
    window.appState.members.forEach(member => {
        const trainerObj = window.appState.members.find(t => t.id === member.trainerId);
        const trainerName = trainerObj ? trainerObj.name : 'بدون مدرب';

        bodyHTML += `<tr>`;
        bodyHTML += `<td class="member-cell">
            <div style="font-size: 0.98rem; font-weight: 800; color: var(--silver-light);">${member.name}</div>
            <div style="font-size: 0.75rem; color: var(--yellow-light); font-weight: normal;">${member.role}</div>
            <div class="trainer-tag-sub" onclick="openAssignTrainerModalFor('${member.id}')">
                <i class="fa-solid fa-chalkboard-user"></i> المدرب: ${trainerName} <i class="fa-solid fa-pen-to-square" style="font-size:0.65rem;"></i>
            </div>
        </td>`;

        window.appState.skills.forEach(skill => {
            const key = `${member.id}_${skill.id}`;
            const currentStatus = window.appState.matrix[key] || 'not-started';
            bodyHTML += `
                <td class="status-cell" onclick="cycleSkillStatus('${member.id}', '${skill.id}')">
                    ${getStatusBadgeHTML(currentStatus)}
                </td>
            `;
        });

        bodyHTML += `<td>
            <button class="btn btn-danger btn-sm" title="حذف العضو" onclick="deleteMember('${member.id}')"><i class="fa-solid fa-user-xmark"></i></button>
        </td>`;
        bodyHTML += `</tr>`;
    });

    tbody.innerHTML = bodyHTML;
}

function getStatusBadgeHTML(status) {
    switch(status) {
        case 'trainer':
            return `<span class="badge-status status-trainer"><i class="fa-solid fa-chalkboard-user"></i> مدرب معتمد</span>`;
        case 'completed':
            return `<span class="badge-status status-completed"><i class="fa-solid fa-check"></i> مكتمل</span>`;
        case 'pending':
            return `<span class="badge-status status-pending"><i class="fa-solid fa-clock"></i> قيد التكوين</span>`;
        default:
            return `<span class="badge-status status-not-started"><i class="fa-solid fa-minus"></i> لم يبدأ</span>`;
    }
}

function cycleSkillStatus(memberId, skillId) {
    const key = `${memberId}_${skillId}`;
    const statuses = ['not-started', 'pending', 'completed', 'trainer'];
    const current = window.appState.matrix[key] || 'not-started';
    const nextIndex = (statuses.indexOf(current) + 1) % statuses.length;
    window.appState.matrix[key] = statuses[nextIndex];
    saveState();
}

// Tree View
function renderHierarchicalTree() {
    const container = document.getElementById('treeWrapper');
    if (!container) return;
    container.innerHTML = '';

    const mainTrainers = window.appState.members.filter(m => !m.trainerId || m.role.includes('مُدرّب') || m.role.includes('رئيسي'));

    if (mainTrainers.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--silver-dark); padding: 30px;">لا يوجد مدربون مضافون بعد.</div>`;
        return;
    }

    mainTrainers.forEach(trainer => {
        const trainees = window.appState.members.filter(m => m.trainerId === trainer.id);

        const groupCard = document.createElement('div');
        groupCard.className = 'trainer-group-card';

        let traineesHTML = '';
        if (trainees.length === 0) {
            traineesHTML = `<div style="color: var(--silver-dark); font-size: 0.85rem; padding: 10px;">لا يوجد متدربون منسوبون لـ ${trainer.name} بعد.</div>`;
        } else {
            trainees.forEach(tr => {
                traineesHTML += `
                    <div class="trainee-node-card">
                        <div class="trainee-user-info">
                            <div class="trainee-mini-avatar">${tr.name.charAt(0)}</div>
                            <div>
                                <div style="font-weight: 700; color: var(--silver-light); font-size: 0.92rem;">${tr.name}</div>
                                <div style="font-size: 0.75rem; color: var(--silver-dark);">${tr.role}</div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="openAssignTrainerModalFor('${tr.id}')">
                            <i class="fa-solid fa-repeat"></i> نقل
                        </button>
                    </div>
                `;
            });
        }

        groupCard.innerHTML = `
            <div class="trainer-header-box">
                <div class="trainer-main-info">
                    <div class="trainer-avatar-large">${trainer.name.charAt(0)}</div>
                    <div>
                        <h3 style="color: var(--yellow-light); font-size: 1.2rem;">${trainer.name}</h3>
                        <div style="font-size: 0.85rem; color: var(--silver-dark);">${trainer.role}</div>
                        <span style="display:inline-block; margin-top: 4px; background: rgba(56, 189, 248, 0.15); color: var(--info); padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">
                            <i class="fa-solid fa-users"></i> إجمالي المتدربين عنده: ${trainees.length} أعضاء
                        </span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="openAssignTraineeToTrainer('${trainer.id}')">
                    <i class="fa-solid fa-plus"></i> إضافة/ربط متدرب لـ ${trainer.name}
                </button>
            </div>

            <div style="font-weight: 700; color: var(--yellow-primary); font-size: 0.88rem; margin-bottom: 12px;">
                <i class="fa-solid fa-diagram-project"></i> قائمة الأعضاء المتدربين تحت إشرافه:
            </div>

            <div class="trainee-branch-grid">
                ${traineesHTML}
            </div>
        `;

        container.appendChild(groupCard);
    });
}

// EXAM SECTION LOGIC
function switchExamSubTab(subId) {
    document.querySelectorAll('.sub-btn-exam').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.exam-sub-content').forEach(c => c.style.display = 'none');

    if (subId === 'take') {
        document.getElementById('subBtnTakeExam').classList.add('active');
        document.getElementById('examSubTake').style.display = 'block';
    } else if (subId === 'grading') {
        document.getElementById('subBtnGrading').classList.add('active');
        document.getElementById('examSubGrading').style.display = 'block';
    } else if (subId === 'manage') {
        document.getElementById('subBtnManageExam').classList.add('active');
        document.getElementById('examSubManage').style.display = 'block';
    }
}

function toggleCustomMemberInput(val) {
    const customGroup = document.getElementById('customMemberGroup');
    if (!customGroup) return;
    if (val === 'custom_name') {
        customGroup.style.display = 'block';
        document.getElementById('customMemberName').focus();
    } else {
        customGroup.style.display = 'none';
    }
}

function renderExamSection() {
    const memberSelect = document.getElementById('examMemberSelect');
    if (!memberSelect) return;

    let opts = `<option value="">-- اختر اسمك للبدء في الاختبار --</option>`;
    window.appState.members.forEach(m => {
        opts += `<option value="${m.id}">${m.name} (${m.role})</option>`;
    });
    opts += `<option value="custom_name">✍️ اسمي غير موجود (كتابة الاسم يدوياً)...</option>`;
    memberSelect.innerHTML = opts;

    const qContainer = document.getElementById('examQuestionsContainer');
    if (window.appState.questions.length === 0) {
        qContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--silver-dark);">لا توجد أسئلة مضافة في الاختبار حالياً. قم بإضافة أسئلة من تبويب "إدارة الأسئلة".</div>`;
    } else {
        let qHTML = '';
        window.appState.questions.forEach((q, idx) => {
            qHTML += `
                <div class="question-item-card">
                    <h4 style="color: var(--yellow-light); margin-bottom: 8px;">السؤال ${idx + 1}: ${q.text}</h4>
                    <div class="form-group" style="margin-bottom: 0;">
                        <textarea id="ans_q_${q.id}" class="form-control" rows="3" placeholder="اكتب إجابتك الوافية هنا..."></textarea>
                    </div>
                </div>
            `;
        });
        qContainer.innerHTML = qHTML;
    }

    renderGradingSubmissions();
    renderManageQuestions();
}

function submitExamAnswers() {
    const memberSelectVal = document.getElementById('examMemberSelect').value;
    if (!memberSelectVal) return alert('يرجى اختيار اسمك أولاً!');

    let studentName = '';
    let memberId = memberSelectVal;

    if (memberSelectVal === 'custom_name') {
        studentName = document.getElementById('customMemberName').value.trim();
        if (!studentName) return alert('يرجى كتابة اسمك الكامل وصفتك في النادي!');
    } else {
        const found = window.appState.members.find(m => m.id === memberSelectVal);
        studentName = found ? found.name : 'عضو النادي';
    }

    const answers = {};
    let hasAnsweredAny = false;
    window.appState.questions.forEach(q => {
        const txt = document.getElementById(`ans_q_${q.id}`) ? document.getElementById(`ans_q_${q.id}`).value.trim() : '';
        answers[q.id] = txt;
        if (txt) hasAnsweredAny = true;
    });

    if (!hasAnsweredAny) return alert('يرجى كتابة الإجابة على الأسئلة قبل الإرسال!');

    const submission = {
        id: 'sub_' + Date.now(),
        memberId: memberId,
        customMemberName: memberSelectVal === 'custom_name' ? studentName : '',
        date: new Date().toLocaleDateString('ar-EG') + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        answers: answers,
        status: 'pending',
        grades: {},
        notes: ''
    };

    window.appState.submissions.push(submission);
    saveState();

    // Show beautiful success screen
    const formWrapper = document.getElementById('examFormWrapper');
    const successCard = document.getElementById('examSuccessCard');
    const successMsg = document.getElementById('examSuccessMsg');

    if (formWrapper && successCard) {
        formWrapper.style.display = 'none';
        if (successMsg) {
            successMsg.innerText = `شكراً لك يا (${studentName})! تم تسليم إجاباتك بنجاح لإدارة النادي والمدرب المشرف لمراجعتها وتصحيحها.`;
        }
        successCard.style.display = 'block';
    } else {
        alert('تم إرسال إجاباتك بنجاح! سيتم مراجعتها وتصحيحها من قِبل المدرب/المشرف.');
    }
}

function renderGradingSubmissions() {
    const container = document.getElementById('gradingSubmissionsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (window.appState.submissions.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--silver-dark); padding: 25px;">لا توجد إجابات مُقدّمة بانتظار التصحيح حالياً.</div>`;
        return;
    }

    window.appState.submissions.forEach(sub => {
        const memberObj = window.appState.members.find(m => m.id === sub.memberId);
        const memberName = sub.customMemberName || (memberObj ? memberObj.name : 'عضو سابق');

        const subCard = document.createElement('div');
        subCard.className = 'grading-submission-card';

        let qListHTML = '';
        window.appState.questions.forEach((q, idx) => {
            const ansText = sub.answers[q.id] || '(لم يتم تقديم إجابة)';
            const currentGrade = sub.grades[q.id];

            let gradeStatusBadge = '';
            if (currentGrade === true) gradeStatusBadge = `<span style="color:#6ee7b7; font-weight:700;"><i class="fa-solid fa-circle-check"></i> صحيح</span>`;
            else if (currentGrade === false) gradeStatusBadge = `<span style="color:#fca5a5; font-weight:700;"><i class="fa-solid fa-circle-xmark"></i> غير صحيح</span>`;

            qListHTML += `
                <div style="background: rgba(6, 11, 20, 0.7); border: 1px solid var(--border-silver); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <strong style="color: var(--yellow-light);">س${idx + 1}: ${q.text}</strong>
                        <div>${gradeStatusBadge}</div>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--silver-dark); margin-bottom: 6px;">
                        💡 توجيه الإجابة النموذجية: ${q.guide || 'لا يوجد'}
                    </div>
                    <div style="background: rgba(15, 28, 48, 0.9); padding: 10px; border-radius: 6px; font-size: 0.92rem; color: var(--silver-light); margin-bottom: 10px;">
                        <strong>إجابة العضو:</strong> ${ansText}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm" onclick="setGradeQuestion('${sub.id}', '${q.id}', true)">
                            <i class="fa-solid fa-check"></i> تقييم: صحيح ✔️
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="setGradeQuestion('${sub.id}', '${q.id}', false)">
                            <i class="fa-solid fa-xmark"></i> تقييم: خطأ ❌
                        </button>
                    </div>
                </div>
            `;
        });

        subCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-silver); padding-bottom: 10px; margin-bottom: 15px;">
                <div>
                    <h3 style="color: var(--silver-light); font-size: 1.15rem;">إجابة العضو: <span style="color: var(--yellow-primary);">${memberName}</span></h3>
                    <span style="font-size: 0.78rem; color: var(--silver-dark);">تاريخ الإرسال: ${sub.date} | الحالة: ${sub.status === 'corrected' ? '<span style="color:#6ee7b7">تم التصحيح ✔️</span>' : '<span style="color:#fde047">بانتظار التصحيح ⏳</span>'}</span>
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteSubmission('${sub.id}')">
                    <i class="fa-solid fa-trash"></i> حذف
                </button>
            </div>

            ${qListHTML}

            <div class="form-group" style="margin-top: 15px;">
                <label>ملاحظات وتوجيه المشرف/المدرب للعضو:</label>
                <input type="text" id="sub_note_${sub.id}" class="form-control" value="${sub.notes || ''}" placeholder="اكتب توجيهاً أو تشجيعاً للعضو...">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
                <button class="btn btn-primary" onclick="saveSubmissionGrading('${sub.id}')">
                    <i class="fa-solid fa-floppy-disk"></i> اعتماد واعتماد النتيجة للعضو
                </button>
            </div>
        `;

        container.appendChild(subCard);
    });
}

function setGradeQuestion(submissionId, questionId, isCorrect) {
    const sub = window.appState.submissions.find(s => s.id === submissionId);
    if (sub) {
        if (!sub.grades) sub.grades = {};
        sub.grades[questionId] = isCorrect;
        saveState();
    }
}

function saveSubmissionGrading(submissionId) {
    const sub = window.appState.submissions.find(s => s.id === submissionId);
    if (sub) {
        sub.notes = document.getElementById(`sub_note_${sub.id}`) ? document.getElementById(`sub_note_${sub.id}`).value : '';
        sub.status = 'corrected';
        saveState();
        alert('تم اعتماد نتيجة وتصحيح العضو بنجاح!');
    }
}

function deleteSubmission(subId) {
    if (!confirm('هل أنت متاكد من حذف إجابة هذا العضو؟')) return;
    window.appState.submissions = window.appState.submissions.filter(s => s.id !== subId);
    saveState();
}

// Manage Questions
function renderManageQuestions() {
    const container = document.getElementById('manageQuestionsContainer');
    if (!container) return;
    container.innerHTML = '';

    window.appState.questions.forEach((q, idx) => {
        const qBox = document.createElement('div');
        qBox.className = 'question-item-card';
        qBox.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h4 style="color: var(--yellow-light); font-size: 1.05rem;">السؤال ${idx + 1}: ${q.text}</h4>
                    <p style="font-size: 0.85rem; color: var(--silver-dark); margin-top: 4px;">💡 التوجيه/الإجابة النموذجية: ${q.guide || 'غير محددة'}</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteQuestion('${q.id}')">
                    <i class="fa-solid fa-trash"></i> حذف السؤال
                </button>
            </div>
        `;
        container.appendChild(qBox);
    });
}

function openAddQuestionModal() {
    document.getElementById('modalAddQuestion').classList.add('active');
}

function confirmAddQuestion() {
    const text = document.getElementById('newQuestionText').value.trim();
    const guide = document.getElementById('newQuestionGuide').value.trim();

    if (!text) return alert('يرجى كتابة نص السؤال!');

    const q = { id: 'q_' + Date.now(), text, guide };
    window.appState.questions.push(q);
    saveState();
    closeModal('modalAddQuestion');
    document.getElementById('newQuestionText').value = '';
    document.getElementById('newQuestionGuide').value = '';
}

function deleteQuestion(qId) {
    if (!confirm('هل أنت متاكد من حذف هذا السؤال من الاختبار؟')) return;
    window.appState.questions = window.appState.questions.filter(q => q.id !== qId);
    saveState();
}

// Render Member Profiles
function renderProfiles() {
    const grid = document.getElementById('memberProfilesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    window.appState.members.forEach(member => {
        const totalSkills = window.appState.skills.length;
        let completedCount = 0;
        window.appState.skills.forEach(s => {
            const st = window.appState.matrix[`${member.id}_${s.id}`];
            if (st === 'completed' || st === 'trainer') completedCount++;
        });

        const pct = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;
        const trainerObj = window.appState.members.find(t => t.id === member.trainerId);

        const memberSubmissions = window.appState.submissions.filter(s => s.memberId === member.id);
        let examStatusBadge = `<span style="font-size:0.75rem; color: var(--silver-dark);"><i class="fa-solid fa-pen"></i> لم يقدم الاختبار</span>`;
        if (memberSubmissions.length > 0) {
            const lastSub = memberSubmissions[memberSubmissions.length - 1];
            if (lastSub.status === 'corrected') {
                examStatusBadge = `<span style="font-size:0.75rem; color: #6ee7b7;"><i class="fa-solid fa-circle-check"></i> أدى الاختبار وتم تصحيحه</span>`;
            } else {
                examStatusBadge = `<span style="font-size:0.75rem; color: #fde047;"><i class="fa-solid fa-clock"></i> قدم الاختبار وبانتظار التصحيح</span>`;
            }
        }

        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <div>
                <div class="profile-header">
                    <div class="profile-avatar">${member.name.charAt(0)}</div>
                    <div class="profile-info">
                        <h3>${member.name}</h3>
                        <p>${member.role}</p>
                        <div style="font-size:0.78rem; color: var(--info); margin-top:2px;">
                            <i class="fa-solid fa-chalkboard-user"></i> المدرب: ${trainerObj ? trainerObj.name : 'مستقل / مدرب'}
                        </div>
                        <div style="margin-top: 4px;">
                            ${examStatusBadge}
                        </div>
                    </div>
                </div>

                <div class="progress-bar-container">
                    <div class="progress-label">
                        <span>نسبة استكمال المهارات والميثاق</span>
                        <strong>${pct}%</strong>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${pct}%;"></div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 15px; display:flex; gap: 8px;">
                <button class="btn btn-primary btn-sm" style="flex:1; justify-content: center;" onclick="openCertificateModal('${member.name}')">
                    <i class="fa-solid fa-award"></i> الشهادة
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openAssignTrainerModalFor('${member.id}')" title="تغيير المدرب">
                    <i class="fa-solid fa-user-pen"></i> المدرب
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modals & Action Controls
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function populateTrainerDropdowns() {
    const addSelect = document.getElementById('newMemberTrainer');
    const assignTrainerSelect = document.getElementById('assignTrainerSelect');
    const assignTraineeSelect = document.getElementById('assignTraineeSelect');

    let trainerOptionsHTML = `<option value="">بدون مدرب (مستقل / مدرب رئيسي)</option>`;
    let traineeOptionsHTML = '';

    window.appState.members.forEach(m => {
        trainerOptionsHTML += `<option value="${m.id}">${m.name} (${m.role})</option>`;
        traineeOptionsHTML += `<option value="${m.id}">${m.name} (${m.role})</option>`;
    });

    if (addSelect) addSelect.innerHTML = trainerOptionsHTML;
    if (assignTrainerSelect) assignTrainerSelect.innerHTML = trainerOptionsHTML;
    if (assignTraineeSelect) assignTraineeSelect.innerHTML = traineeOptionsHTML;
}

function openAddSkillModal() { document.getElementById('modalAddSkill').classList.add('active'); }
function openAddMemberModal() { 
    populateTrainerDropdowns();
    document.getElementById('modalAddMember').classList.add('active'); 
}
function openAddConductModal() { document.getElementById('modalAddConduct').classList.add('active'); }

function openAssignTrainerModal() {
    populateTrainerDropdowns();
    document.getElementById('modalAssignTrainer').classList.add('active');
}

function openAssignTrainerModalFor(memberId) {
    populateTrainerDropdowns();
    document.getElementById('assignTraineeSelect').value = memberId;
    const currentMember = window.appState.members.find(m => m.id === memberId);
    if (currentMember) {
        document.getElementById('assignTrainerSelect').value = currentMember.trainerId || '';
    }
    document.getElementById('modalAssignTrainer').classList.add('active');
}

function openAssignTraineeToTrainer(trainerId) {
    populateTrainerDropdowns();
    document.getElementById('assignTrainerSelect').value = trainerId;
    document.getElementById('modalAssignTrainer').classList.add('active');
}

function confirmAssignTrainer() {
    const traineeId = document.getElementById('assignTraineeSelect').value;
    const trainerId = document.getElementById('assignTrainerSelect').value || null;

    if (!traineeId) return alert('يرجى اختيار العضو المتدرب');
    if (traineeId === trainerId) return alert('لا يمكن تعيين العضو كمدرب لنفسه!');

    const member = window.appState.members.find(m => m.id === traineeId);
    if (member) {
        member.trainerId = trainerId;
        saveState();
        closeModal('modalAssignTrainer');
    }
}

function confirmAddSkill() {
    const name = document.getElementById('newSkillName').value.trim();
    const cat = document.getElementById('newSkillCategory').value;
    if (!name) return alert('يرجى إدخال اسم المهارة');

    const id = 's_' + Date.now();
    window.appState.skills.push({ id, name, category: cat });
    saveState();
    closeModal('modalAddSkill');
    document.getElementById('newSkillName').value = '';
}

function deleteSkill(skillId) {
    if (!confirm('هل أنت متاكد من حذف هذه المهارة نهائياً من المصفوفة؟')) return;
    window.appState.skills = window.appState.skills.filter(s => s.id !== skillId);
    saveState();
}

function confirmAddMember() {
    const name = document.getElementById('newMemberName').value.trim();
    const role = document.getElementById('newMemberRole').value;
    const trainerId = document.getElementById('newMemberTrainer').value || null;

    if (!name) return alert('يرجى إدخال اسم العضو');

    const id = 'm_' + Date.now();
    window.appState.members.push({ id, name, role, trainerId });
    saveState();
    closeModal('modalAddMember');
    document.getElementById('newMemberName').value = '';
}

function deleteMember(memberId) {
    if (!confirm('هل أنت متاكد من حذف هذا العضو؟')) return;
    window.appState.members = window.appState.members.filter(m => m.id !== memberId);
    window.appState.members.forEach(m => {
        if (m.trainerId === memberId) m.trainerId = null;
    });
    saveState();
}

function confirmAddConduct() {
    const title = document.getElementById('newConductTitle').value.trim();
    const cat = document.getElementById('newConductCategory').value;
    const desc = document.getElementById('newConductDesc').value.trim();
    const scenario = document.getElementById('newConductScenario').value.trim();

    if (!title || !desc) return alert('يرجى ملء العنوان والشرح');

    const id = 'c_' + Date.now();
    window.appState.conductItems.push({ id, title, category: cat, desc, scenario });
    saveState();
    closeModal('modalAddConduct');
}

function deleteConduct(id) {
    if (!confirm('هل أنت متاكد من حذف هذا البند من الميثاق؟')) return;
    window.appState.conductItems = window.appState.conductItems.filter(c => c.id !== id);
    saveState();
}

// System Settings
function saveSystemSettings() {
    window.appState.docTitle = document.getElementById('settingDocTitle').value.trim();
    window.appState.subtitle = document.getElementById('settingSubtitle').value.trim();
    saveState();
    alert('تم حفظ الإعدادات والتحديثات بنجاح!');
}

function exportFullJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `josour_takwin_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function exportMatrixCSV() {
    let csv = "\uFEFFاسم العضو,الدور,المدرب المشرف," + window.appState.skills.map(s => `"${s.name}"`).join(",") + "\n";
    window.appState.members.forEach(m => {
        const trObj = window.appState.members.find(t => t.id === m.trainerId);
        let row = `"${m.name}","${m.role}","${trObj ? trObj.name : 'مستقل'}",`;
        row += window.appState.skills.map(s => `"${window.appState.matrix[`${m.id}_${s.id}`] || 'not-started'}"`).join(",");
        csv += row + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `skills_matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function resetToSampleData() {
    if (!confirm('هل تريد إعادة ضبط البيانات إلى الحالة النموذجية الأولى؟')) return;
    window.appState = getFreshDefaultState();
    saveState();
}

// Print Certificate
function openCertificateModal(memberName) {
    document.getElementById('certMemberName').innerText = memberName;
    document.getElementById('modalCertificate').classList.add('active');
}

function printCertificatePNG() {
    const node = document.getElementById('certificatePrintArea');
    html2canvas(node, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `شهادة_تكوين_${document.getElementById('certMemberName').innerText}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// Check & Apply Student Exam-Only Mode (?mode=exam or #exam)
function checkExamOnlyMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = (window.location.hash || '').toLowerCase();
    const isExamMode = urlParams.get('mode') === 'exam' || 
                       urlParams.get('exam') === '1' || 
                       urlParams.get('exam') === 'true' || 
                       urlParams.get('view') === 'exam' || 
                       hash === '#exam' || 
                       hash === '#test';

    if (isExamMode) {
        document.body.classList.add('exam-only-mode');
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        const examTab = document.getElementById('tab-exam');
        if (examTab) examTab.classList.add('active');
        if (typeof switchExamSubTab === 'function') {
            switchExamSubTab('take');
        }
        document.title = "اختبار التكوين والتأهيل | نادي جسور";
    } else {
        document.body.classList.remove('exam-only-mode');
    }
}

// Auto Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    checkExamOnlyMode();
});

window.addEventListener('hashchange', () => {
    checkExamOnlyMode();
});
