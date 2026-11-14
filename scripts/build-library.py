import json
from pathlib import Path

def save(name, data):
    Path('src/data/' + name + '.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf8')

names = json.loads(Path('scripts/source-names.json').read_text(encoding='utf8'))
english = ['Competition squat','Paused bench press (1 s)','Chest-supported cable row','Bulgarian split squat','Pallof press','Conventional deadlift','Paused bench press (2 s)','Pull-up / lat pulldown','Leg curl','Dead bug','Competition paused bench press','Paused squat (2 s)','Romanian deadlift','Cable triceps extension','Face pull','Side plank','Easy walk / bike','Gentle mobility','Test — squat','Test — paused bench press','Test — conventional deadlift']
patterns = ['squat','press','row','squat','core','hinge','press','pull','curlLeg','core','press','squat','hinge','triceps','row','core','cardio','mobility','squat','press','hinge']
extra = '''Фронтальный присед|Front squat|squat|barbell
Гоблет-присед|Goblet squat|squat|dumbbell
Жим ногами|Leg press|squat|machine
Гакк-присед|Hack squat|squat|machine
Выпады назад|Reverse lunge|squat|dumbbell
Зашагивания|Step-up|squat|dumbbell
Присед с собственным весом|Bodyweight squat|squat|bodyweight
Присед к скамье|Box squat|squat|barbell
Разгибание ног|Leg extension|curlLeg|machine
Ягодичный мост|Glute bridge|hinge|bodyweight
Хип-траст|Hip thrust|hinge|barbell
Тяга с плинтов|Block pull|hinge|barbell
Тяга гири|Kettlebell deadlift|hinge|dumbbell
Гиперэкстензия|Back extension|hinge|machine
Румынская тяга с гантелями|Dumbbell RDL|hinge|dumbbell
Сгибание ног лёжа|Lying leg curl|curlLeg|machine
Сгибание ног с резинкой|Band leg curl|curlLeg|band
Отжимания|Push-up|press|bodyweight
Жим гантелей лёжа|Dumbbell bench press|press|dumbbell
Жим гантелей на наклонной|Incline dumbbell press|press|dumbbell
Жим в тренажёре|Machine chest press|press|machine
Жим с пола|Floor press|press|barbell
Жим стоя|Overhead press|press|barbell
Жим гантелей сидя|Seated dumbbell press|press|dumbbell
Сведение рук в блоке|Cable fly|press|cable
Отжимания от скамьи с упором|Incline push-up|press|bodyweight
Тяга гантели к поясу|One-arm dumbbell row|row|dumbbell
Тяга штанги в наклоне|Barbell row|row|barbell
Тяга резинки|Band row|row|band
Австралийские подтягивания|Inverted row|row|bodyweight
Вертикальная тяга нейтральным хватом|Neutral lat pulldown|pull|cable
Подтягивания нейтральным хватом|Neutral pull-up|pull|bodyweight
Пуловер в блоке|Cable pullover|pull|cable
Тяга резинки сверху|Band pulldown|pull|band
Разведение гантелей в стороны|Lateral raise|shoulder|dumbbell
Обратная бабочка|Reverse pec deck|row|machine
Разведение с резинкой|Band pull-apart|row|band
Сгибание рук со штангой|Barbell curl|biceps|barbell
Сгибание рук с гантелями|Dumbbell curl|biceps|dumbbell
Молотковые сгибания|Hammer curl|biceps|dumbbell
Сгибание рук на скамье Скотта|Preacher curl|biceps|machine
Сгибание рук в блоке|Cable curl|biceps|cable
Обратные сгибания|Reverse curl|biceps|barbell
Разгибание рук над головой|Overhead triceps extension|triceps|cable
Узкий жим|Close-grip bench press|press|barbell
Разгибание рук с резинкой|Band pressdown|triceps|band
Подъём на носки стоя|Standing calf raise|calf|machine
Подъём на носки сидя|Seated calf raise|calf|machine
Планка|Plank|core|bodyweight
Bird dog|Bird dog|core|bodyweight
Скручивания в блоке|Cable crunch|core|cable
Переноска фермера|Farmer carry|grip|dumbbell
Чемоданная переноска|Suitcase carry|core|dumbbell
Вис на перекладине|Dead hang|grip|bodyweight
Сжатие эспандера|Gripper squeeze|grip|gripper
Пронация на ремне|Belt pronation|pronation|cable
Сгибание кисти в блоке|Cable cupping|cup|cable
Райзинг с ремнём|Belt rising|rising|dumbbell
Тяга назад на ремне|Belt back pressure|biceps|cable
Боковое давление изометрия|Side-pressure isometric|side|band
Разгибание кисти|Wrist extension|wrist|dumbbell
Разгибание пальцев с резинкой|Band finger extension|grip|band
Супинация с лёгкой гантелью|Light supination|wrist|dumbbell
Изометрия пронации|Pronation isometric|pronation|band
Изометрия сгибания кисти|Cupping isometric|cup|band
Вращение плеча наружу|External shoulder rotation|shoulder|band
Ходьба на дорожке|Treadmill walk|cardio|machine
Велотренажёр|Stationary bike|cardio|machine
Эллипс|Elliptical|cardio|machine
Мобильность голеностопа|Ankle mobility|mobility|bodyweight
Мобильность грудного отдела|Thoracic rotation|mobility|bodyweight
Дыхание 90/90|90/90 breathing|mobility|bodyweight'''
specs=[(f'ex-{i}',ru,english[i],patterns[i], 'bodyweight' if i in [9,15,16,17] else 'cable' if i in [2,4,7,13,14] else 'machine' if i==8 else 'dumbbell' if i==3 else 'barbell') for i,ru in enumerate(names)]
specs += [(f'ex-{i+len(names)}',*line.split('|')) for i,line in enumerate(extra.splitlines())]
tips={
'squat':('Стойка по строению таза; вся стопа на опоре. Колени по направлению носков. Брейсинг 360° до спуска. Наклон корпуса индивидуален. Сохраняй глубину и баланс.', 'Choose stance for your hips; keep the whole foot planted. Knees follow toes. Brace 360 degrees before descending. Torso angle is individual. Keep consistent depth and balance.'),
'press':('Ступни устойчивы; голова, верх спины и ягодицы на скамье. Лопатки стабильны, мост комфортный. Запястье над предплечьем. Контролируемое касание, пауза, без отбива.', 'Plant feet; keep head, upper back and glutes on the bench. Stabilize shoulder blades with a comfortable arch. Stack wrists over forearms. Control the touch and pause; never bounce.'),
'hinge':('Классика: стойка около ширины таза, руки снаружи коленей. Гриф над серединой стопы. Убери слабину, напряги широчайшие. Дави в пол, таз и плечи вместе. Гриф близко. Финиш вертикально без переразгибания. Для румынской тяги: мягкие колени, таз назад, только контролируемая амплитуда.', 'Conventional: hip-width stance, hands outside knees, bar over midfoot. Take slack out and engage lats. Push the floor, raise hips and shoulders together, keep bar close. Lock out vertically without leaning back. For RDL: soft knees, hips back, only controlled range.'),
'row':('Зафиксируй корпус. Веди локти назад без рывка. Удерживай шею нейтрально. Возвращай вес медленно.', 'Stabilize torso. Drive elbows back without jerking. Keep neck neutral. Return the load slowly.'),
'pull':('Начни с контроля лопаток. Веди локти к рёбрам. Не раскачивайся; возвращайся подконтрольно.', 'Control shoulder blades. Drive elbows toward ribs. Avoid swinging and control the return.'),
'core':('Таз и рёбра стабильны. Дыши ровно, не задерживай дыхание до головокружения. Заверши подход до потери положения.', 'Keep pelvis and ribs stable. Breathe evenly, never hold to dizziness. End the set before position breaks.'),
'biceps':('Плечо стабильно, локоть не уходит вперёд. Сгибай без раскачки. Опускай 2–3 секунды; оставь 2–3 повтора в запасе.', 'Keep upper arm stable and elbow still. Curl without swinging. Lower for 2–3 seconds; keep 2–3 reps in reserve.'),
'triceps':('Локти неподвижны у корпуса. Разгибай плавно, без болезненного щелчка. Контролируй возврат.', 'Keep elbows still near the torso. Extend smoothly without painful locking. Control the return.'),
'curlLeg':('Настрой ось тренажёра по колену. Таз стабилен. Контролируй сгибание и медленное опускание.', 'Align machine pivot with knee. Stabilize hips. Control the curl and slow return.'),
'cardio':('Разговорный темп 20–25 минут. Не ставь перед тяжёлым приседом или тягой. Увеличивай время постепенно.', 'Use conversational pace for 20–25 minutes. Avoid before heavy squats or deadlifts. Increase duration gradually.'),
'mobility':('Двигайся в комфортной амплитуде. Дыши спокойно. Не растягивай до боли.', 'Move through comfortable range. Breathe calmly. Never stretch into pain.'),
'shoulder':('Корпус стабилен. Работай в безболезненной амплитуде. Не пожимай плечами; опускай медленно.', 'Keep torso stable. Use pain-free range. Avoid shrugging and lower slowly.'),
'calf':('Опора всей передней частью стопы. Поднимайся без пружины. Контролируй опускание.', 'Support through forefoot. Rise without bouncing. Control lowering.'),
'grip':('Нейтральная кисть, умеренное усилие. Дыши ровно. Заверши до боли или потери хвата.', 'Keep wrist neutral with moderate effort. Breathe evenly. Stop before pain or grip failure.'),
}
for pat in ['pronation','cup','rising','side','wrist']:
 tips[pat]=('Локоть с опорой, плечо и кисть согласованы. Лёгкий вес, плавная эксцентрика 3–4 с или изометрия 10–20 с. Не скручивай плечевую кость. Острая боль в кисти, локте или плече — немедленно стоп.', 'Support elbow and align shoulder and wrist. Light load, 3–4 s eccentric or 10–20 s isometric. Never twist the humerus. Stop immediately for sharp wrist, elbow or arm pain.')
muscles={'squat':['quads','glutes'],'hinge':['hamstrings','glutes','back'],'press':['chest','triceps'],'row':['back','rearDelts'],'pull':['back','biceps'],'core':['core'],'biceps':['biceps'],'triceps':['triceps'],'curlLeg':['hamstrings'],'shoulder':['delts'],'calf':['calves'],'grip':['forearms'],'cardio':['cardio'],'mobility':['mobility']}
library=[]
for id,ru,en,pat,eq in specs:
 injuries=['knee','hip'] if pat=='squat' else ['lowerBack'] if pat=='hinge' else ['shoulder','wrist'] if pat=='press' else ['elbow','wrist'] if pat in ['biceps','pronation','cup','rising','side','wrist'] else []
 library.append(dict(id=id,name={'ru':ru,'en':en},muscles=muscles.get(pat,['forearms']),secondary=['core'] if pat in ['squat','hinge','row'] else [],pattern=pat,equipment=eq,difficulty='intermediate' if eq=='barbell' or pat=='side' else 'beginner',injuries=injuries,substitutions=[s[0] for s in specs if s[3]==pat and s[0]!=id],cues=[{'ru':tips[pat][0],'en':tips[pat][1]}],mistakes={'ru':'Рывки, потеря опоры, работа до технического отказа.','en':'Jerking, unstable support, training to technical failure.'},safety={'ru':'RPE — потолок. При острой или нарастающей боли прекрати упражнение.','en':'RPE is a ceiling. Stop for sharp or worsening pain.'},videoCheck={'ru':'Сбоку и под углом: стабильность, амплитуда, симметрия. Для классической тяги — строго сбоку.','en':'Side and angled view: stability, range, symmetry. Conventional deadlift: strictly side view.'},media={}))
save('exercises',library)
plan=json.loads(Path('src/data/powerlifting.json').read_text(encoding='utf8'))
for row in plan: row['tip']['en']=library[int(row['exercise'][3:])]['cues'][0]['en']
save('powerlifting',plan)
Path('MEDIA_TODO.md').write_text('# Exercise media\n\nNo unlicensed external media is embedded. Add your own GIF/WebP/MP4, then set media.localPath in src/data/exercises.json. SVG technique diagrams are intentional fallbacks.\n\n'+ '\n'.join('- '+e['name']['en']+': public/media/exercises/'+e['id']+'.webp (or .gif / .mp4)' for e in library),encoding='utf8')
print(len(library),'exercises;',len(plan),'prescriptions')
