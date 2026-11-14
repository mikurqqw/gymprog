import json
from pathlib import Path
# Approximate edible-portion values; dry grains and cooked meats are explicitly named.
rows='''Гречка сухая|Buckwheat dry|343|13.3|3.4|71.5|starch
Рис сухой|Rice dry|360|7|.7|80|starch
Овсянка сухая|Oats dry|370|13|7|62|starch
Макароны сухие|Pasta dry|350|12|1.5|71|starch,gluten
Картофель варёный|Boiled potato|82|2|.1|18|starch
Булгур сухой|Bulgur dry|342|12|1.3|76|starch,gluten
Перловка сухая|Pearl barley dry|352|10|1.2|78|starch,gluten
Пшено сухое|Millet dry|378|11|4.2|73|starch
Кускус сухой|Couscous dry|376|12.8|.6|77|starch,gluten
Киноа сухая|Quinoa dry|368|14|6|64|starch
Куриная грудка готовая|Chicken breast cooked|165|31|3.6|0|protein,meat
Индейка готовая|Turkey cooked|150|29|3|0|protein,meat
Тунец в собственном соку|Tuna canned in water|116|25.5|.8|0|protein,meat,fish
Треска готовая|Cod cooked|89|20|.7|0|protein,meat,fish
Минтай готовый|Pollock cooked|111|24|1|0|protein,meat,fish
Творог 2%|Cottage cheese 2%|103|18|2|3.3|protein,dairy
Тофу|Tofu|80|10|4|2|protein,soy
Сейтан|Seitan|120|24|1.5|4|protein,gluten
Яичный белок|Egg white|48|11|.2|.7|protein,egg
Говядина постная готовая|Lean beef cooked|190|29|8|0|meat
Баранина готовая|Lamb cooked|250|26|16|0|meat
Свинина готовая|Pork cooked|260|27|16|0|meat,pork
Куриное бедро готовое|Chicken thigh cooked|210|26|11|0|meat
Печень говяжья готовая|Beef liver cooked|175|26|5|5|meat
Лосось|Salmon|208|20|13|0|meat,fish
Скумбрия|Mackerel|205|19|14|0|meat,fish
Сельдь|Herring|158|18|9|0|meat,fish
Сардины|Sardines|208|25|11|0|meat,fish
Креветки|Shrimp|99|24|.3|.2|meat,shellfish
Кальмар|Squid|92|16|1.4|3|meat,shellfish
Яйцо целое|Whole egg|143|12.6|9.5|.7|egg
Кефир 1%|Kefir 1%|40|3|1|4|dairy
Молоко 2.5%|Milk 2.5%|52|3|2.5|4.7|dairy
Йогурт натуральный|Plain yogurt|60|4|3|5|dairy
Йогурт греческий 2%|Greek yogurt 2%|73|10|2|3.5|dairy
Творог 5%|Cottage cheese 5%|121|17|5|3|dairy
Сыр|Cheese|350|25|27|0|dairy
Ряженка|Ryazhenka|67|3|4|4|dairy
Айран|Ayran|30|2|1|3|dairy
Сметана 10%|Sour cream 10%|119|3|10|4|dairy
Чечевица варёная|Lentils cooked|116|9|.4|20|legume
Фасоль варёная|Beans cooked|127|9|.5|23|legume
Нут варёный|Chickpeas cooked|164|9|2.6|27|legume
Горох варёный|Peas cooked|118|8|.4|21|legume
Хлеб ржаной|Rye bread|210|6|1|43|gluten
Хлеб цельнозерновой|Wholegrain bread|247|13|4|41|gluten
Лаваш|Lavash|275|9|1|57|gluten
Кукурузная крупа сухая|Corn grits dry|360|8|1.5|79|starch
Огурец|Cucumber|15|.7|.1|3.6|vegetable
Помидор|Tomato|18|.9|.2|3.9|vegetable
Капуста|Cabbage|25|1.3|.1|5.8|vegetable
Брокколи|Broccoli|34|2.8|.4|6.6|vegetable
Морковь|Carrot|41|.9|.2|9.6|vegetable
Кабачок|Zucchini|17|1.2|.3|3.1|vegetable
Перец сладкий|Sweet pepper|31|1|.3|6|vegetable
Шпинат|Spinach|23|2.9|.4|3.6|vegetable
Цветная капуста|Cauliflower|25|1.9|.3|5|vegetable
Свёкла|Beetroot|43|1.6|.2|9.6|vegetable
Лук|Onion|40|1.1|.1|9.3|vegetable
Баклажан|Eggplant|25|1|.2|6|vegetable
Зелёная фасоль|Green beans|31|1.8|.2|7|vegetable
Грибы|Mushrooms|22|3.1|.3|3.3|vegetable
Яблоко|Apple|52|.3|.2|14|fruit
Банан|Banana|89|1.1|.3|23|fruit
Апельсин|Orange|47|.9|.1|12|fruit
Груша|Pear|57|.4|.1|15|fruit
Мандарин|Mandarin|53|.8|.3|13|fruit
Виноград|Grapes|69|.7|.2|18|fruit
Киви|Kiwi|61|1.1|.5|15|fruit
Клубника|Strawberry|32|.7|.3|7.7|fruit
Черника|Blueberry|57|.7|.3|14|fruit
Курага|Dried apricot|241|3.4|.5|63|fruit
Изюм|Raisins|299|3.1|.5|79|fruit
Финики|Dates|282|2.5|.4|75|fruit
Грецкий орех|Walnut|654|15|65|14|nuts
Миндаль|Almond|579|21|50|22|nuts
Арахис|Peanut|567|26|49|16|nuts,peanut
Кешью|Cashew|553|18|44|30|nuts
Семечки подсолнечника|Sunflower seed|584|21|51|20|seeds
Семена льна|Flax seed|534|18|42|29|seeds
Оливковое масло|Olive oil|900|0|100|0|oil
Подсолнечное масло|Sunflower oil|900|0|100|0|oil
Сливочное масло|Butter|717|.9|81|.1|dairy
Авокадо|Avocado|160|2|15|9|fruit
Мёд|Honey|304|.3|0|82|sweet
Сахар|Sugar|400|0|0|100|sweet
Горький шоколад|Dark chocolate|598|8|43|46|sweet
Вода|Water|0|0|0|0|drink
Чай без сахара|Unsweetened tea|1|0|0|.2|drink
Кофе без сахара|Black coffee|2|.1|0|0|drink'''
foods=[]
for i,line in enumerate(rows.splitlines()):
    ru,en,kcal,p,f,c,tags=line.split('|')
    foods.append(dict(id='food-'+str(i),name={'ru':ru,'en':en},kcal=float(kcal),p=float(p),f=float(f),c=float(c),tags=tags.split(',')))
Path('src/data/foods.json').write_text(json.dumps(foods,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print(len(foods),'foods')
