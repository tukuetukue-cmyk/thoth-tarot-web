import json
import re

with open('/Users/tukue/.gemini/antigravity/scratch/thoth_tarot_project/thoth-tarot-web/public/src/js/tree-of-life.js', 'r') as f:
    content = f.read()

# SEPHIROTH array replacements
# Adding English inquiries for SEPHIROTH
content = content.replace('inquiry: "あなたが本当に成し遂げたいと願う「純粋な意志」は何ですか？"', 'inquiry: "あなたが本当に成し遂げたいと願う「純粋な意志」は何ですか？", inquiry_en: "What is the \'pure will\' that you truly wish to accomplish?"')
content = content.replace('inquiry: "今、あなたの内側から湧き上がっている抑えきれない衝動は何ですか？"', 'inquiry: "今、あなたの内側から湧き上がっている抑えきれない衝動は何ですか？", inquiry_en: "What uncontrollable urge is welling up from within you right now?"')
content = content.replace('inquiry: "形にするために、あなたが今受け入れ、制限すべきものは何ですか？"', 'inquiry: "形にするために、あなたが今受け入れ、制限すべきものは何ですか？", inquiry_en: "To give it form, what must you accept and limit right now?"')
content = content.replace('inquiry: "あなたが今、最も自分を許し、豊かさを広げるべき領域はどこですか？"', 'inquiry: "あなたが今、最も自分を許し、豊かさを広げるべき領域はどこですか？", inquiry_en: "In what area must you forgive yourself the most and expand your abundance?"')
content = content.replace('inquiry: "真の強さを得るために、今あなたが断ち切るべきものは何ですか？"', 'inquiry: "真の強さを得るために、今あなたが断ち切るべきものは何ですか？", inquiry_en: "To gain true strength, what must you sever right now?"')
content = content.replace('inquiry: "あなたの内なる光と陰が調和したとき、世界にはどんな「美」がもたらされますか？"', 'inquiry: "あなたの内なる光と陰が調和したとき、世界にはどんな「美」がもたらされますか？", inquiry_en: "When your inner light and shadow harmonize, what kind of \'beauty\' is brought into the world?"')
content = content.replace('inquiry: "論理を超えて、あなたの心が心底求めている喜びは何ですか？"', 'inquiry: "論理を超えて、あなたの心が心底求めている喜びは何ですか？", inquiry_en: "Beyond logic, what joy does your heart truly seek?"')
content = content.replace('inquiry: "あふれる感情を現実に活かすために、どんな「思考の型」が必要ですか？"', 'inquiry: "あふれる感情を現実に活かすために、どんな「思考の型」が必要ですか？", inquiry_en: "To utilize your overflowing emotions in reality, what \'mold of thought\' is necessary?"')
content = content.replace('inquiry: "あなたの無意識の底で、まだ目覚めを待っている可能性は何ですか？"', 'inquiry: "あなたの無意識の底で、まだ目覚めを待っている可能性は何ですか？", inquiry_en: "At the bottom of your unconscious, what possibility is still waiting to awaken?"')
content = content.replace('inquiry: "ここまでのすべての気づきを、今日「現実の行動」としてどう生かしますか？"', 'inquiry: "ここまでのすべての気づきを、今日「現実の行動」としてどう生かしますか？", inquiry_en: "How will you apply all the realizations so far as \'practical action\' today?"')

# DAATH
content = content.replace('inquiry: "あなたが直視することを恐れている、あなた自身の「隠された真実」は何ですか？"', 'inquiry: "あなたが直視することを恐れている、あなた自身の「隠された真実」は何ですか？", inquiry_en: "What is your own \'hidden truth\' that you are afraid to face directly?"')

# SEPHIROTH descriptions
content = content.replace('description: "存在の根源。すべてが流出する究極の一点。「在る」という純粋な意志。"', 'description: "存在の根源。すべてが流出する究極の一点。「在る」という純粋な意志。", desc_en: "The source of existence. The ultimate point from which all emanates. The pure will \'to be\'."')
content = content.replace('description: "最初の閃き。方向を持たない純粋なエネルギーの噴出。父なる力。"', 'description: "最初の閃き。方向を持たない純粋なエネルギーの噴出。父なる力。", desc_en: "The first flash. The eruption of pure, undirected energy. The paternal force."')
content = content.replace('description: "形を与える母。理解と制限により、混沌に構造を与える。大いなる海。"', 'description: "形を与える母。理解と制限により、混沌に構造を与える。大いなる海。", desc_en: "The mother who gives form. Giving structure to chaos through understanding and restriction. The great sea."')
content = content.replace('description: "恩寵と拡張。秩序ある慈愛により万物を育む建設的な力。"', 'description: "恩寵と拡張。秩序ある慈愛により万物を育む建設的な力。", desc_en: "Grace and expansion. A constructive force that nurtures all things through orderly benevolence."')
content = content.replace('description: "裁きと浄化の炎。不要なものを焼き払い、真の強さを鍛え上げる。"', 'description: "裁きと浄化の炎。不要なものを焼き払い、真の強さを鍛え上げる。", desc_en: "The flame of judgment and purification. Burning away the unnecessary, forging true strength."')
content = content.replace('description: "生命の樹の中心。上位と下位を調和させる太陽の如き美と均衡。"', 'description: "生命の樹の中心。上位と下位を調和させる太陽の如き美と均衡。", desc_en: "The center of the Tree of Life. A sun-like beauty and equilibrium that harmonizes the higher and lower."')
content = content.replace('description: "感情、芸術、情熱。本能的な欲求と美的な喜びを生み出す豊かなエネルギー。"', 'description: "感情、芸術、情熱。本能的な欲求と美的な喜びを生み出す豊かなエネルギー。", desc_en: "Emotion, art, passion. A rich energy that generates instinctive desires and aesthetic joy."')
content = content.replace('description: "知性、コミュニケーション、論理。流動するエネルギーを思考によって型に流し込む。"', 'description: "知性、コミュニケーション、論理。流動するエネルギーを思考によって型に流し込む。", desc_en: "Intellect, communication, logic. Pouring fluid energy into molds through thought."')
content = content.replace('description: "アストラル界の基盤。夢と無意識が物質世界へ投影される門。"', 'description: "アストラル界の基盤。夢と無意識が物質世界へ投影される門。", desc_en: "The foundation of the astral plane. The gate through which dreams and the unconscious are projected into the material world."')
content = content.replace('description: "物質世界。すべての力が最終的に顕現する場所。私たちの現実。"', 'description: "物質世界。すべての力が最終的に顕現する場所。私たちの現実。", desc_en: "The material world. The place where all forces ultimately manifest. Our reality."')

# DAATH description
content = content.replace('description: "深淵の向こう側にある「知識」。セフィラではなく、上位三角形と下位七セフィラの間の裂け目。"', 'description: "深淵の向こう側にある「知識」。セフィラではなく、上位三角形と下位七セフィラの間の裂け目。", desc_en: "\'Knowledge\' across the Abyss. Not a Sephira, but the rift between the supernal triangle and the lower seven Sephiroth."')


# PATHS descriptions
content = content.replace('inquiry: "未知なるものへ飛び込むために、あなたが手放すべき「常識」は何ですか？"', 'inquiry: "未知なるものへ飛び込むために、あなたが手放すべき「常識」は何ですか？", inquiry_en: "To dive into the unknown, what \'common sense\' must you let go of?"')
content = content.replace('inquiry: "あなたに与えられた才能を、どう現実に形づくりますか？"', 'inquiry: "あなたに与えられた才能を、どう現実に形づくりますか？", inquiry_en: "How will you give form to your given talents in reality?"')
content = content.replace('inquiry: "静寂の中で、あなたの内なる声は何を語りかけていますか？"', 'inquiry: "静寂の中で、あなたの内なる声は何を語りかけていますか？", inquiry_en: "In the silence, what is your inner voice telling you?"')
content = content.replace('inquiry: "あなたが今、豊かに育み、愛を注ぐべき対象は何ですか？"', 'inquiry: "あなたが今、豊かに育み、愛を注ぐべき対象は何ですか？", inquiry_en: "What should you richly nurture and pour your love into right now?"')
content = content.replace('inquiry: "絶望の先に、あなたが希望を見出している「星」は何ですか？"', 'inquiry: "絶望の先に、あなたが希望を見出している「星」は何ですか？", inquiry_en: "Beyond despair, what \'star\' do you find hope in?"')
content = content.replace('inquiry: "あなたが頑なに守り続けている「信念」は、本当にあなた自身のものですか？"', 'inquiry: "あなたが頑なに守り続けている「信念」は、本当にあなた自身のものですか？", inquiry_en: "Is the \'belief\' you stubbornly hold onto truly your own?"')
content = content.replace('inquiry: "今のあなたが統合すべき「相反する二つのもの」は何ですか？"', 'inquiry: "今のあなたが統合すべき「相反する二つのもの」は何ですか？", inquiry_en: "What \'two opposing things\' must you integrate right now?"')
content = content.replace('inquiry: "あなたの人生の「戦車」を前進させるための明確な目的地はどこですか？"', 'inquiry: "あなたの人生の「戦車」を前進させるための明確な目的地はどこですか？", inquiry_en: "Where is the clear destination to drive the \'chariot\' of your life forward?"')
content = content.replace('inquiry: "あなたの中に眠る「野性的な情熱」を、どう飼い慣らし、力に変えますか？"', 'inquiry: "あなたの中に眠る「野性的な情熱」を、どう飼い慣らし、力に変えますか？", inquiry_en: "How will you tame and transform the \'wild passion\' sleeping within you into power?"')
content = content.replace('inquiry: "他者の声から離れ、自分一人の光を見つめる時間を持てていますか？"', 'inquiry: "他者の声から離れ、自分一人の光を見つめる時間を持てていますか？", inquiry_en: "Are you taking the time to distance yourself from the voices of others and gaze at your own solitary light?"')
content = content.replace('inquiry: "コントロールできない運命の輪の中で、あなたが自らの意志で選べることは何ですか？"', 'inquiry: "コントロールできない運命の輪の中で、あなたが自らの意志で選べることは何ですか？", inquiry_en: "Within the uncontrollable wheel of fortune, what can you choose of your own free will?"')
content = content.replace('inquiry: "あなたの人生において、今もっとも「バランス」を必要としている領域はどこですか？"', 'inquiry: "あなたの人生において、今もっとも「バランス」を必要としている領域はどこですか？", inquiry_en: "In your life, what area most requires \'balance\' right now?"')
content = content.replace('inquiry: "視点を変えるために、あなたが今「あえて身を委ねるべきこと」は何ですか？"', 'inquiry: "視点を変えるために、あなたが今「あえて身を委ねるべきこと」は何ですか？", inquiry_en: "To change your perspective, what must you \'deliberately surrender to\' right now?"')
content = content.replace('inquiry: "新しく生まれ変わるために、あなたが今終わらせるべきものは何ですか？"', 'inquiry: "新しく生まれ変わるために、あなたが今終わらせるべきものは何ですか？", inquiry_en: "To be reborn anew, what must you bring to an end right now?"')
content = content.replace('inquiry: "相反する要素を混ぜ合わせることで、どんな「新しいあなた」が創造されますか？"', 'inquiry: "相反する要素を混ぜ合わせることで、どんな「新しいあなた」が創造されますか？", inquiry_en: "By blending opposing elements, what \'new you\' will be created?"')
content = content.replace('inquiry: "あなたを縛り付けている「物質的な執着」や「見えない鎖」の正体は何ですか？"', 'inquiry: "あなたを縛り付けている「物質的な執着」や「見えない鎖」の正体は何ですか？", inquiry_en: "What is the true nature of the \'material attachments\' or \'invisible chains\' binding you?"')
content = content.replace('inquiry: "あなたの古い価値観が崩れ去った後、そこにはどんな真実が残りますか？"', 'inquiry: "あなたの古い価値観が崩れ去った後、そこにはどんな真実が残りますか？", inquiry_en: "After your old values crumble away, what truth remains there?"')
content = content.replace('inquiry: "あなたの世界に秩序をもたらすために、今どのようなリーダーシップが必要ですか？"', 'inquiry: "あなたの世界に秩序をもたらすために、今どのようなリーダーシップが必要ですか？", inquiry_en: "To bring order to your world, what kind of leadership is needed right now?"')
content = content.replace('inquiry: "暗闇の中であなたを惑わす「幻想」や「恐怖」は、本当は何を教えていますか？"', 'inquiry: "暗闇の中であなたを惑わす「幻想」や「恐怖」は、本当は何を教えていますか？", inquiry_en: "What are the \'illusions\' or \'fears\' confusing you in the dark truly trying to teach you?"')
content = content.replace('inquiry: "あなたが最も純粋に「生かされている」と感じる瞬間はどんな時ですか？"', 'inquiry: "あなたが最も純粋に「生かされている」と感じる瞬間はどんな時ですか？", inquiry_en: "When are the moments you feel most purely \'alive\'?"')
content = content.replace('inquiry: "古い時代が終わり、あなたが今から歩み出す「新しい時代」とはどんなものですか？"', 'inquiry: "古い時代が終わり、あなたが今から歩み出す「新しい時代」とはどんなものですか？", inquiry_en: "As the old era ends, what is this \'new era\' you are stepping into?"')
content = content.replace('inquiry: "あなたが今完成させ、そして次なる次元へと昇華させるべきテーマは何ですか？"', 'inquiry: "あなたが今完成させ、そして次なる次元へと昇華させるべきテーマは何ですか？", inquiry_en: "What is the theme you must now complete and elevate to the next dimension?"')

# PATH ASTROLOGICAL en
content = content.replace('astrological: "風"', 'astrological: "風", astrological_en: "Air"')
content = content.replace('astrological: "水星"', 'astrological: "水星", astrological_en: "Mercury"')
content = content.replace('astrological: "月"', 'astrological: "月", astrological_en: "Moon"')
content = content.replace('astrological: "金星"', 'astrological: "金星", astrological_en: "Venus"')
content = content.replace('astrological: "水瓶座"', 'astrological: "水瓶座", astrological_en: "Aquarius"')
content = content.replace('astrological: "牡牛座"', 'astrological: "牡牛座", astrological_en: "Taurus"')
content = content.replace('astrological: "双子座"', 'astrological: "双子座", astrological_en: "Gemini"')
content = content.replace('astrological: "蟹座"', 'astrological: "蟹座", astrological_en: "Cancer"')
content = content.replace('astrological: "獅子座"', 'astrological: "獅子座", astrological_en: "Leo"')
content = content.replace('astrological: "乙女座"', 'astrological: "乙女座", astrological_en: "Virgo"')
content = content.replace('astrological: "木星"', 'astrological: "木星", astrological_en: "Jupiter"')
content = content.replace('astrological: "天秤座"', 'astrological: "天秤座", astrological_en: "Libra"')
content = content.replace('astrological: "水"', 'astrological: "水", astrological_en: "Water"')
content = content.replace('astrological: "蠍座"', 'astrological: "蠍座", astrological_en: "Scorpio"')
content = content.replace('astrological: "射手座"', 'astrological: "射手座", astrological_en: "Sagittarius"')
content = content.replace('astrological: "山羊座"', 'astrological: "山羊座", astrological_en: "Capricorn"')
content = content.replace('astrological: "火星"', 'astrological: "火星", astrological_en: "Mars"')
content = content.replace('astrological: "牡羊座"', 'astrological: "牡羊座", astrological_en: "Aries"')
content = content.replace('astrological: "魚座"', 'astrological: "魚座", astrological_en: "Pisces"')
content = content.replace('astrological: "太陽"', 'astrological: "太陽", astrological_en: "Sun"')
content = content.replace('astrological: "火"', 'astrological: "火", astrological_en: "Fire"')
content = content.replace('astrological: "土星"', 'astrological: "土星", astrological_en: "Saturn"')


with open('/Users/tukue/.gemini/antigravity/scratch/thoth_tarot_project/thoth-tarot-web/public/src/js/tree-of-life.js', 'w') as f:
    f.write(content)

