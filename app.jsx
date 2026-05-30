/* =========================================================
   アウジュア KA クエスト  ✦  すごろくクイズアプリ
   - 問題データは添付PDF（KA2025 / KA2026 解答編）より作成
   - c[0] が正解。表示時に選択肢はシャッフルされます。
   ========================================================= */
const { useState, useEffect, useRef } = React;

/* ---------------- 問題データ（全100問） ---------------- */
const C_HAIR = "毛髪・頭皮・肌";
const C_CARE = "ヘアケア";
const C_COLOR = "ヘアカラー";
const C_SOC = "社会知識";

const QUESTIONS = [
  /* ===== KA2025 / A 毛髪&頭皮&肌知識 ===== */
  { cat:C_HAIR, q:"地肌の「スカルプフローラ」を3つに分類すると、善玉菌・悪玉菌と、普段は影響のない「何菌」でしょう？", c:["日和見菌","常在菌","中間菌","待機菌"] },
  { cat:C_HAIR, q:"水を吸収しやすい毛髪を「吸水毛」というのに対し、水をはじきやすい毛髪を何というでしょう？", c:["撥水毛","疎水毛","防水毛","反水毛"] },
  { cat:C_HAIR, q:"毛髪は酸性・アルカリ性のどちらに傾くと膨潤するでしょう？", c:["アルカリ性","酸性","中性","弱酸性"] },
  { cat:C_HAIR, q:"女性が男性に比べてむくみやすいとされる主な理由は何でしょう？", c:["男性より筋肉量が少なくリンパを流す力が弱いため","水分摂取量が多いため","皮下脂肪が少ないため","体温が低いため"] },
  { cat:C_HAIR, q:"水分を保持しにくい「疎水性タンパク質」に対して、水分を保持しやすいタンパク質を何というでしょう？", c:["親水性タンパク質","保水性タンパク質","含水性タンパク質","吸水性タンパク質"] },
  { cat:C_HAIR, q:"表皮を4層に分けた時、皮脂膜のすぐ下にあり、やがて細胞が剥がれ落ちていく層を何というでしょう？", c:["角質層","顆粒層","有棘層","基底層"] },
  { cat:C_HAIR, q:"元素記号Znで表され、牡蠣やスルメに多く含まれ、皮膚や髪の生成に欠かせないミネラルは何でしょう？", c:["亜鉛","鉄","銅","カルシウム"] },
  { cat:C_HAIR, q:"髪の毛の断面を海苔巻きに例えた時、「具」にあたる中心部の構造は何でしょう？", c:["メデュラ","コルテックス","キューティクル","シスチン"] },
  { cat:C_HAIR, q:"ヘアサイクルを大きく3つの時期に分類すると？", c:["成長期・退行期・休止期","成長期・安定期・休止期","発生期・成長期・脱毛期","成長期・活動期・停止期"] },
  { cat:C_HAIR, q:"毛髪のキューティクル最表面にある、キューティクルにしか存在しない脂肪酸の一種を何というでしょう？", c:["18-MEA","CMC","NMF","PCA"] },
  { cat:C_HAIR, q:"頭皮のハリを支える3つのキー成分のうち、特に肌の厚みを保つ働きを担うのは何でしょう？", c:["コラーゲン","エラスチン","ヒアルロン酸","ケラチン"] },
  { cat:C_HAIR, q:"骨や皮膚・血管などの代謝をうながすエストロゲンは、別名「何ホルモン」と呼ばれているでしょう？", c:["女性ホルモン","成長ホルモン","副腎皮質ホルモン","甲状腺ホルモン"] },
  { cat:C_HAIR, q:"「加齢毛」「エイジング毛」ともいい、毛髪内の密度が低下しスカスカになる状態を漢字4文字で何というでしょう？", c:["毛粗鬆症","毛髪萎縮","毛包炎症","毛幹空洞"] },
  { cat:C_HAIR, q:"髪・頭皮・肌の大敵である紫外線を、アルファベット2文字で何というでしょう？", c:["UV","UA","IR","BB"] },
  { cat:C_HAIR, q:"夜のスキンケアで、次のアイテムを使う正しい順番は？（乳液 / 化粧水 / クレンジング料 / 洗顔料）", c:["クレンジング→洗顔→化粧水→乳液","洗顔→クレンジング→化粧水→乳液","クレンジング→洗顔→乳液→化粧水","化粧水→洗顔→クレンジング→乳液"] },

  /* ===== KA2025 / B ヘアケア知識 ===== */
  { cat:C_CARE, q:"Aujuaのライン「デイライト」の3商品とは、「デイライト エッセンス」「デイライト セラム」と何でしょう？", c:["デイライト シャワー","デイライト ミルク","デイライト ミスト","デイライト オイル"] },
  { cat:C_CARE, q:"ビタミンB6を配合し、エイジングで失われた水分保持力を高めるのに効果的なAujuaのシャンプーはどれ？", c:["タイムサージ","イミュライズ","ディオーラム","クエンチ"] },
  { cat:C_CARE, q:"次のワードから連想されるAujuaのラインは？（シャンプー250mL 3,500円／リーブインはフルイド／香りの花は年2回咲く）", c:["リペアリティ","クエンチ","グロウシブ","モイストカーム"] },
  { cat:C_CARE, q:"Aujuaデイライトのアスコルビン酸誘導体は、油溶性ビタミンの働きで「何」のダメージから髪を守るでしょう？", c:["ラジカル（活性酸素）","紫外線","熱","乾燥"] },
  { cat:C_CARE, q:"「エイジングスパ クリアフォーム」の1回の使用量の目安は、何の果物1個分の大きさでしょう？", c:["グレープフルーツ","りんご","みかん","レモン"] },
  { cat:C_CARE, q:"Aujuaモイストカームに含まれる「アプリコット油」。アプリコットとは日本語でどんな果物でしょう？", c:["あんず","もも","うめ","すもも"] },
  { cat:C_CARE, q:"Aujua「エクスシールド」で付着を防げる、花粉など大気中に浮遊する物質を総称して何というでしょう？", c:["ポリューション","アレルゲン","フリーラジカル","ダストパーティクル"] },
  { cat:C_CARE, q:"Aujuaインメトリィの「コントロールクリーム」は、トリートメント前・後のどちらで用いるのが適切でしょう？", c:["トリートメント前","トリートメント後","シャンプー前","ドライ後"] },
  { cat:C_CARE, q:"Aujuaの製品開発にも活用される、兵庫県にある世界最高性能の大型放射光施設は何でしょう？", c:["Spring-8","SACLA","KEK","J-PARC"] },
  { cat:C_CARE, q:"Aujuaクエンチの香りのイメージの元となっている花は何でしょう？", c:["牡丹","椿","薔薇","百合"] },
  { cat:C_CARE, q:"Aujuaグロウシブに配合されている、4種のシソ科植物のエキスを何というでしょう？", c:["4-BBエキス","4-MSKエキス","3D-CMADK","ハーバルエキス"] },
  { cat:C_CARE, q:"セリ科の漢方植物で、根から抽出したエキスが毛髪保護成分としてAujua「プレセディア」に使われる植物は？", c:["トウキ（当帰）","センキュウ","オウギ","ニンジン"] },
  { cat:C_CARE, q:"Aujuaヘアニュートリエントに含まれる共通の保湿成分はどれでしょう？（ゴマ／シロップ／バター／ハチミツ）", c:["ハチミツ","シロップ","バター","ゴマ"] },
  { cat:C_CARE, q:"Aujua 4STEPサロントリートメント、1st STEPのミディアム・ロングへの1パネルあたりのPush数は何回？", c:["5回","3回","7回","10回"] },
  { cat:C_CARE, q:"Aujua 4STEPサロントリートメントにおいて、2nd STEPの主な目的は何でしょう？", c:["脂質補給","水分補給","タンパク質補給","pH調整"] },

  /* ===== KA2025 / C ヘアカラー知識 ===== */
  { cat:C_COLOR, q:"メラニンのタイプは色味やツヤで4つに分類されます。その4色をすべて答えると？", c:["赤・青・黄・灰","赤・青・黄・白","赤・緑・黄・黒","赤・青・緑・灰"] },
  { cat:C_COLOR, q:"黄色の補色は何色でしょう？", c:["紫","緑","青","オレンジ"] },
  { cat:C_COLOR, q:"黄色と青色を混ぜると、何色になるでしょう？", c:["緑","紫","オレンジ","茶"] },
  { cat:C_COLOR, q:"18色相環で、メインカラー（基調色）の隣にあたる色を何というでしょう？", c:["サブカラー（補助色）","アクセントカラー","ベースカラー","トーンカラー"] },
  { cat:C_COLOR, q:"ミルボンレベルスケールにおける8LVのアンダーカラーは何色でしょう？", c:["赤色（レッド）","オレンジ","黄色","青色"] },
  { cat:C_COLOR, q:"髪の内側数箇所に薬剤を塗り、残留色素や発色を確認するテストを「何テスト」というでしょう？", c:["ストランドテスト","パッチテスト","アレルギーテスト","カラーテスト"] },
  { cat:C_COLOR, q:"染毛料の「ヘアマニキュア」は次のうちどれでしょう？（中性／酸性／アルカリ）", c:["酸性カラー","中性カラー","アルカリカラー","塩基性カラー"] },
  { cat:C_COLOR, q:"ベースカラーと異なる色を顔まわりだけに入れる、海外発のトレンドスタイルを何というでしょう？", c:["フェイスフレーミング","インナーカラー","ハイライト","バレイヤージュ"] },
  { cat:C_COLOR, q:"赤ワインのような濃い赤紫色を、フランスのワイン産地名から何というでしょう？", c:["ボルドー","バーガンディ","ワインレッド","マルサラ"] },
  { cat:C_COLOR, q:"5月の誕生石で、緑を基調色としたORDEVE Addicthyのカラー剤名にもなっているのは何でしょう？", c:["エメラルド","ジェイド","ペリドット","マラカイト"] },
  { cat:C_COLOR, q:"ORDEVE Addicthyペールラインで、ペールシルバーとペールカーキに共通する基調色は何でしょう？", c:["灰","緑","青","紫"] },
  { cat:C_COLOR, q:"ORDEVE Addicthyにある、基調色・補助色ともに無色のヘアカラー剤の名前は何でしょう？", c:["クリア","ナチュラル","プレーン","ベース"] },
  { cat:C_COLOR, q:"ミルボンのヘアカラースケールは、最大で何レベルまであるでしょう？", c:["20","15","18","25"] },
  { cat:C_COLOR, q:"ORDEVE Addicthyスタンダードラインで、基調色を灰・補助色を緑とする色味の名前は何でしょう？", c:["グレーパール","グレージュ","カーキアッシュ","スモーキーグレー"] },
  { cat:C_COLOR, q:"「脱色」に対し、髪に入れたカラーの染料をリセットすることを漢字2文字で何というでしょう？", c:["脱染","脱色","除染","退色"] },

  /* ===== KA2025 / D 社会知識 ===== */
  { cat:C_SOC, q:"2025年、大阪・関西万博は4月13日からいつまで開催されるでしょう？", c:["10月13日","9月13日","7月13日","5月13日"] },
  { cat:C_SOC, q:"2025年9月の世界陸上競技選手権大会はどこで開催されるでしょう？", c:["東京","上海","ソウル","バンコク"] },
  { cat:C_SOC, q:"時速500km、東京〜大阪間を約1時間で結ぶとされる、将来開設予定の新幹線は何でしょう？", c:["リニア中央新幹線","北陸新幹線","北海道新幹線","東海道新幹線のぞみ"] },
  { cat:C_SOC, q:"2025年1月20日に第47代アメリカ大統領に就任したのは誰でしょう？", c:["ドナルド・トランプ","ジョー・バイデン","バラク・オバマ","カマラ・ハリス"] },
  { cat:C_SOC, q:"Z世代の次にあたる、2010年代以降生まれの世代を「何世代」というでしょう？", c:["α世代（アルファ）","β世代","Y世代","デジタル世代"] },

  /* ===== KA2026 / A 毛髪&頭皮&肌知識 ===== */
  { cat:C_HAIR, q:"皮膚のターンオーバー（新陳代謝）の周期は、約何日と言われているでしょう？", c:["約28日","約14日","約45日","約60日"] },
  { cat:C_HAIR, q:"コルテックスのタンパク質を2つに分類すると、親水性タンパク質と「何性タンパク質」でしょう？", c:["疎水性タンパク質","撥水性タンパク質","保水性タンパク質","中性タンパク質"] },
  { cat:C_HAIR, q:"大豆などに多く含まれ、女性ホルモンのエストロゲンと似た働きをする成分は何でしょう？", c:["イソフラボン","サポニン","レシチン","カテキン"] },
  { cat:C_HAIR, q:"頭蓋骨を帽子のように覆う、薄くて丈夫な結合組織の膜を漢字四文字で何というでしょう？", c:["帽状腱膜","頭皮筋膜","頭蓋結膜","表皮腱膜"] },
  { cat:C_HAIR, q:"表皮のうち、真皮から供給される栄養をもとに新しい細胞が生み出される層を「何層」というでしょう？", c:["基底層","角質層","顆粒層","有棘層"] },
  { cat:C_HAIR, q:"毛髪全体の約10%を占め、タンパク質に次いで2番目に多い成分は何でしょう？", c:["水分","脂質","メラニン","ミネラル"] },
  { cat:C_HAIR, q:"「大汗腺」とも呼ばれ、脇の下などに多く分布する汗腺は何でしょう？", c:["アポクリン腺","エクリン腺","皮脂腺","汗管腺"] },
  { cat:C_HAIR, q:"スカルプフローラを構成する3種類の菌は何でしょう？", c:["善玉菌・悪玉菌・日和見菌","善玉菌・悪玉菌・常在菌","好気菌・嫌気菌・日和見菌","善玉菌・中間菌・悪玉菌"] },
  { cat:C_HAIR, q:"毛髪が酸性側で締まり、アルカリ性側で広がる、この2つの現象をそれぞれ何というでしょう？", c:["収れん・膨潤","収縮・膨張","凝集・拡散","緊縮・弛緩"] },
  { cat:C_HAIR, q:"皮膚や髪の生成に欠かせないミネラル「亜鉛」を、元素記号2文字で表すと何でしょう？", c:["Zn","Zi","Zc","Az"] },
  { cat:C_HAIR, q:"「＋」が多いほど効果が高い、紫外線A波を防ぐ指標をアルファベット2文字で何というでしょう？", c:["PA","UV","SP","UA"] },
  { cat:C_HAIR, q:"肌の水分の蒸発を防ぎ、うるおいを保って柔らかくする作用を「何効果」というでしょう？", c:["エモリエント効果","モイスチャー効果","バリア効果","ヒーリング効果"] },
  { cat:C_HAIR, q:"全国で1000万人以上が発症するとされる「男性型脱毛症」をアルファベット3文字で何というでしょう？", c:["AGA","FGA","UVA","ADL"] },
  { cat:C_HAIR, q:"毛髪の約5%が該当し、毛乳頭細胞が不活性化して毛母細胞の働きが弱まる時期を「何期」というでしょう？", c:["退行期","休止期","成長期","脱毛期"] },
  { cat:C_HAIR, q:"暗闇に反応して脳から分泌され眠気を誘い、強い抗酸化力で肌のダメージ修復にも重要なホルモンは？", c:["メラトニン","セロトニン","メラニン","アドレナリン"] },

  /* ===== KA2026 / B ヘアケア知識 ===== */
  { cat:C_CARE, q:"「整える」「広げる」「すべらす」の工程がある、Aujuaサロントリートメントで髪をなめらかにする技術は？", c:["なめし","ならし","ほぐし","とかし"] },
  { cat:C_CARE, q:"かゆみやフケの原因菌の繁殖を抑える有効成分配合のシャンプーがある、Aujuaのラインは何でしょう？", c:["モイストカーム","クエンチ","リペアリティ","イミュライズ"] },
  { cat:C_CARE, q:"摘み取った後も黄金色を保つキク科の植物で、Aujuaディオーラムの香りイメージにもなっている花は？", c:["イモーテル","カモミール","マリーゴールド","タンポポ"] },
  { cat:C_CARE, q:"「リラクシング マスク」といえば、Aujuaの何というラインの製品でしょう？", c:["エイジングスパ","モイストカーム","クエンチ","インメトリィ"] },
  { cat:C_CARE, q:"4種のシソ科植物エキス「4-BBエキス」を配合した、Aujuaのスカルプケアラインは何でしょう？", c:["グロウシブ","プレセディア","オーセナム","エイジングスパ"] },
  { cat:C_CARE, q:"「トウキ根エキス」や「モウソウチクたけのこ皮エキス」を配合した、Aujuaのラインは何でしょう？", c:["プレセディア","グロウシブ","オーセナム","モイストカーム"] },
  { cat:C_CARE, q:"レスベラトロール（高い抗酸化力を持つポリフェノール）も配合された、Aujuaのスカルプケアラインは？", c:["オーセナム","グロウシブ","プレセディア","クエンチ"] },
  { cat:C_CARE, q:"Aujuaの「ヘアニュートリエント」が展開されているラインの組み合わせはどれでしょう？", c:["クエンチ・アクアヴィア・イミュライズ","クエンチ・モイストカーム・イミュライズ","クエンチ・アクアヴィア・グロウシブ","リペアリティ・アクアヴィア・イミュライズ"] },
  { cat:C_CARE, q:"赤身魚やヒレ肉などに多く含まれ、Aujuaタイムサージにも配合されているビタミンは何でしょう？", c:["ビタミンB6","ビタミンB2","ビタミンC","ビタミンE"] },
  { cat:C_CARE, q:"Aujua「クエンチライン」の洗い流さないトリートメント3種類の剤型はどれでしょう？", c:["ミスト・フルイド・セラム","ミルク・フルイド・セラム","ミスト・オイル・セラム","ミスト・フルイド・クリーム"] },
  { cat:C_CARE, q:"ポリフェノールの一種「フェルラ酸」を配合し、傷んだキューティクルを補修するAujuaのラインは？", c:["エクスシールド","デイライト","リペアリティ","クエンチ"] },
  { cat:C_CARE, q:"Aujua 7STEPサロントリートメントで、1st STEPから7th STEPまでの間に「お流し」の行程は何回ある？", c:["2回","1回","3回","4回"] },
  { cat:C_CARE, q:"Aujuaインメトリィに配合される2種類のCMADKとは、MX-CMADKと何でしょう？", c:["3D-CMADK","4-BB-CMADK","MS-CMADK","AC-CMADK"] },
  { cat:C_CARE, q:"Aujua全商品に配合されている「iDTコンプレックス」の「D」は何という言葉の略でしょう？", c:["Damage","Density","Direct","Defense"] },
  { cat:C_CARE, q:"次のワードから連想されるAujuaのラインは？（250mL 3,850円／リーブインはフルイド／香りの花「花車」は年2回咲く）", c:["リペアリティ","クエンチ","グロウシブ","デイライト"] },

  /* ===== KA2026 / C ヘアカラー知識 ===== */
  { cat:C_COLOR, q:"ヘアカラーで重要な「色の三属性」といえば、明度・彩度と何でしょう？", c:["色相","純度","階調","濃度"] },
  { cat:C_COLOR, q:"色同士の関係を理解するのに役立つ、色を円形に配置したものを何というでしょう？", c:["カラーサークル（色相環）","カラーチャート","カラーパレット","スペクトル環"] },
  { cat:C_COLOR, q:"根元から複数回に分けて塗り繋げる際に起こる塗布のムラを「何ライン」というでしょう？", c:["ディバイディングライン","ボーダーライン","リタッチライン","コネクトライン"] },
  { cat:C_COLOR, q:"明るさを上げず、色味の補正や黄ばみ消しを目的に「色をかぶせる施術」を何というでしょう？", c:["トナー","ブリーチ","リタッチ","グレイジング"] },
  { cat:C_COLOR, q:"「次に染めるときにムラの原因になりやすい」ことを意味する色素を何というでしょう？", c:["残留色素","残存メラニン","蓄積染料","沈着色素"] },
  { cat:C_COLOR, q:"部分的な白髪が気になる場合、事前に白髪部分へ濃いカラー剤を塗っておくことを何というでしょう？", c:["プレピグメンテーション","ベースアップ","下染め補正","アンダーコート"] },
  { cat:C_COLOR, q:"新生部のメラニンは「赤系」「黄系」に分けられます。「光に透ける髪」はどちらに分類されるでしょう？", c:["黄系メラニンタイプ","赤系メラニンタイプ","青系メラニンタイプ","無彩メラニンタイプ"] },
  { cat:C_COLOR, q:"基調色を紫・補助色を青とするORDEVE Addicthy〈スタンダードライン〉の色味は何でしょう？", c:["アメジスト","サファイア","バイオレット","ラベンダー"] },
  { cat:C_COLOR, q:"ORDEVE Addicthyの2剤は、髪の状態に合わせて使い分ける「4タイプ」がある。〇か✕か？", c:["〇（正しい）","✕（誤り）","どちらでもない","3タイプである"] },
  { cat:C_COLOR, q:"ORDEVE Addicthy 13LVの1剤に対し、2剤を1:1でミックスした場合、仕上がりは何レベルでしょう？", c:["11LV","13LV","12LV","10LV"] },
  { cat:C_COLOR, q:"6色相環で向かい合う「補色」の組み合わせをすべて選ぶと？", c:["赤×緑・黄×紫・橙×青","赤×青・黄×緑・橙×紫","赤×紫・黄×青・橙×緑","赤×橙・黄×緑・青×紫"] },
  { cat:C_COLOR, q:"レベルスケールにおいて、アンダーカラーが「オレンジ」とされるのは何LVでしょう？", c:["13LV","8LV","10LV","15LV"] },
  { cat:C_COLOR, q:"ORDEVE Addicthy〈クリエイティブライン〉で唯一、補助色がなく基調色のみのカラー剤は何でしょう？", c:["ブルー","レッド","クリア","バイオレット"] },
  { cat:C_COLOR, q:"染色構成イメージ図が示す、ORDEVE Addicthy〈スタンダードライン〉の色味は何でしょう？", c:["コバルトブルー","アメジスト","グレーパール","スモーキートパーズ"] },
  { cat:C_COLOR, q:"ORDEVE Addicthy〈スタンダードライン〉のティントマッピングで、最も中心に近いカラー剤は何でしょう？", c:["スモーキートパーズ","グレーパール","コバルトブルー","アメジスト"] },

  /* ===== KA2026 / D 社会知識 ===== */
  { cat:C_SOC, q:"2026年6月開催のFIFAワールドカップで、カナダ・メキシコとともに共同開催国となる国はどこ？", c:["アメリカ","ブラジル","イギリス","日本"] },
  { cat:C_SOC, q:"ミラノ・コルティナ2026冬季五輪フィギュアペアで金メダルを獲得した、三浦璃来・木原龍一組の愛称は？", c:["りくりゅう","りくりゅん","みうきはら","りくいち"] },
  { cat:C_SOC, q:"「恋も喧嘩も命懸け」をコンセプトに、はみ出し者の男女の共同生活を描いたNetflix恋愛リアリティ番組は？", c:["ラヴ上等","恋ステ","バチェロレッテ","あいの里"] },
  { cat:C_SOC, q:"透明でぷっくり、アメのような光沢が特徴で、女子小中学生に人気のシールは何でしょう？", c:["ボンボンドロップシール","ぷくぷくシール","グミシール","キャンディシール"] },
  { cat:C_SOC, q:"2025年家計調査で、消費支出に占める食費の割合が28.6%となった、この割合を示す指標は何でしょう？", c:["エンゲル係数","ジニ係数","消費係数","物価指数"] },
];

/* ---------------- ワールド設定 ---------------- */
const WORLDS = [
  { name:"はじまりの花園",   emoji:"🌸", g1:"#ffd3e8", g2:"#ffb6d9" },
  { name:"きらめきの泉",     emoji:"💧", g1:"#d9e9ff", g2:"#a9d4f0" },
  { name:"ひかりの森",       emoji:"🌿", g1:"#d6f6e6", g2:"#a9f0d9" },
  { name:"ゆめいろの空",     emoji:"☁️", g1:"#ece0ff", g2:"#c9a9ff" },
  { name:"きせきの宮殿",     emoji:"👑", g1:"#fff0d6", g2:"#ffd98a" },
];
const STAGES_PER_WORLD = 20;
const Q_PER_STAGE = 7;
const PASS = 5; // クリアに必要な正解数

/* ---------------- バッジ定義（10種） ---------------- */
const BADGES = [
  { id:"first",     icon:"🎀", name:"はじめの一歩",   desc:"はじめてステージをクリア" },
  { id:"five",      icon:"⭐", name:"5ステージ突破",   desc:"合計5ステージをクリア" },
  { id:"twenty",    icon:"🌟", name:"20ステージ達成", desc:"合計20ステージをクリア" },
  { id:"perfect",   icon:"💯", name:"パーフェクト",     desc:"1ステージ全問正解" },
  { id:"perfect10", icon:"👑", name:"パーフェクトの女王", desc:"パーフェクトを10回達成" },
  { id:"world1",    icon:"🌸", name:"World1 制覇",     desc:"World1を全クリア" },
  { id:"allworld",  icon:"🏆", name:"全World制覇",     desc:"すべてのWorldを全クリア" },
  { id:"streak3",   icon:"🔥", name:"3日連続学習",     desc:"3日連続でアクセス" },
  { id:"streak7",   icon:"🔥", name:"7日連続学習",     desc:"7日連続でアクセス" },
  { id:"weakness",  icon:"💪", name:"弱点克服マスター", desc:"弱点克服モードを全問正解" },
];

/* ---------------- ユーティリティ ---------------- */
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function seededShuffle(arr, seed){ const r=mulberry32(seed); const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function todayStr(){ const d=new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function dayDiff(a,b){ const pa=a.split("-").map(Number),pb=b.split("-").map(Number); const da=new Date(pa[0],pa[1]-1,pa[2]),db=new Date(pb[0],pb[1]-1,pb[2]); return Math.round((db-da)/86400000); }

/* 各ワールドの並び（World1は原順、World2〜5はシャッフル＝反復学習） */
function worldOrder(w){ const idx=[...Array(QUESTIONS.length).keys()]; return w===0 ? idx : seededShuffle(idx, (w+1)*97+31); }
/* ステージ7問の問題インデックス（プールを循環させて20×7=140スロットを満たす） */
function stageQuestionIdx(w, s){ const order=worldOrder(w); const out=[]; for(let i=0;i<Q_PER_STAGE;i++){ out.push(order[(s*Q_PER_STAGE+i)%order.length]); } return out; }

/* ---------------- ストレージ ---------------- */
const LS_KEY="aujua_ka_quest_v1";
const defaultState=()=>({ stars:{}, badges:[], streak:{count:0,last:""}, wrong:[], perfectCount:0 });
function load(){ try{ const s=JSON.parse(localStorage.getItem(LS_KEY)); return s?{...defaultState(),...s}:defaultState(); }catch(e){ return defaultState(); } }
function save(s){ try{ localStorage.setItem(LS_KEY, JSON.stringify(s)); }catch(e){} }

/* ステージ解放判定 */
function stageUnlocked(state, w, s){ if(s===0) return worldUnlocked(state,w); return !!state.stars[`${w}-${s-1}`]; }
function worldCleared(state, w){ for(let s=0;s<STAGES_PER_WORLD;s++){ if(!state.stars[`${w}-${s}`]) return false; } return true; }
function worldUnlocked(state, w){ if(w===0) return true; return worldCleared(state, w-1); }
function totalCleared(state){ return Object.keys(state.stars).length; }

/* ---------------- スパークル装飾 ---------------- */
function Sparkles(){
  const items = useRef([...Array(10)].map((_,i)=>({ left:Math.random()*100, top:Math.random()*100, d:Math.random()*3, s:10+Math.random()*12, e:["✦","✧","⋆","✨"][i%4] }))).current;
  return items.map((it,i)=>(
    <span key={i} className="sparkle" style={{left:it.left+"%", top:it.top+"%", animationDelay:it.d+"s", fontSize:it.s+"px", color:["#ff9ed1","#c9a9ff","#7fe0c2","#ffd98a"][i%4]}}>{it.e}</span>
  ));
}

/* ================= アプリ本体 ================= */
function App(){
  const [state,setState]=useState(load);
  const [screen,setScreen]=useState("worlds"); // worlds | map | quiz | result | badges
  const [curWorld,setCurWorld]=useState(0);
  const [curStage,setCurStage]=useState(0);
  const [quizData,setQuizData]=useState(null);
  const [result,setResult]=useState(null);
  const [toast,setToast]=useState(null);
  const [weakMode,setWeakMode]=useState(false);

  useEffect(()=>{ save(state); },[state]);

  // ストリーク更新（初回マウント）
  useEffect(()=>{
    setState(prev=>{
      const t=todayStr(); const st={...prev.streak};
      if(st.last===t) return prev;
      let count=1;
      if(st.last){ const diff=dayDiff(st.last,t); if(diff===1) count=st.count+1; else if(diff<=0) count=st.count; }
      const ns={...prev, streak:{count, last:t}};
      const ng=awardCheck(ns,[]);
      return ng;
    });
  },[]); // eslint-disable-line

  function showToast(msg){ setToast(msg); setTimeout(()=>setToast(null),2200); }

  // バッジ付与チェック（state を受け取り、新規取得を toast）
  function awardCheck(s, justEarned){
    const have=new Set(s.badges); const add=[];
    const give=(id)=>{ if(!have.has(id)){ have.add(id); add.push(id); } };
    const cleared=totalCleared(s);
    if(cleared>=1) give("first");
    if(cleared>=5) give("five");
    if(cleared>=20) give("twenty");
    if((s.perfectCount||0)>=1) give("perfect");
    if((s.perfectCount||0)>=10) give("perfect10");
    if(worldCleared(s,0)) give("world1");
    if([0,1,2,3,4].every(w=>worldCleared(s,w))) give("allworld");
    if(s.streak.count>=3) give("streak3");
    if(s.streak.count>=7) give("streak7");
    if(s._weaknessClear) give("weakness");
    if(add.length){ const ns={...s, badges:[...have]}; add.forEach(id=>{ const b=BADGES.find(x=>x.id===id); setTimeout(()=>showToast(`${b.icon} バッジ獲得！「${b.name}」`),300); }); return ns; }
    return s;
  }

  /* ステージ開始 */
  function startStage(w,s){
    const idxs=stageQuestionIdx(w,s);
    const qs=idxs.map(i=>{ const base=QUESTIONS[i]; const correct=base.c[0]; const opts=shuffle(base.c); return {poolIdx:i, q:base.q, cat:base.cat, opts, correct}; });
    setCurWorld(w); setCurStage(s); setWeakMode(false);
    setQuizData({ qs, title:`World${w+1} ・ ステージ${s+1}` });
    setScreen("quiz");
  }

  /* 弱点克服モード開始 */
  function startWeakness(){
    const pool=[...new Set(state.wrong)];
    if(pool.length===0){ showToast("弱点はまだありません ✨ まずは挑戦してみよう！"); return; }
    const pick=shuffle(pool).slice(0,Math.min(7,pool.length));
    const qs=pick.map(i=>{ const base=QUESTIONS[i]; const correct=base.c[0]; const opts=shuffle(base.c); return {poolIdx:i, q:base.q, cat:base.cat, opts, correct}; });
    setWeakMode(true);
    setQuizData({ qs, title:"💪 弱点克服モード" });
    setScreen("quiz");
  }

  /* クイズ終了 */
  function finishQuiz(answers){
    const qs=quizData.qs;
    let correctCount=0; const details=[];
    const newWrong=new Set(state.wrong);
    qs.forEach((q,i)=>{ const ok=answers[i]===q.correct; if(ok){ correctCount++; if(weakMode) newWrong.delete(q.poolIdx); } else { newWrong.add(q.poolIdx); } details.push({...q, picked:answers[i], ok}); });

    setState(prev=>{
      let ns={...prev, wrong:[...newWrong]};
      if(!weakMode){
        const passed=correctCount>=PASS;
        if(passed){
          const stars=correctCount>=7?3:correctCount>=6?2:1;
          const key=`${curWorld}-${curStage}`;
          const prevStars=prev.stars[key]||0;
          ns.stars={...prev.stars,[key]:Math.max(prevStars,stars)};
          if(correctCount===Q_PER_STAGE) ns.perfectCount=(prev.perfectCount||0)+1;
        }
      } else {
        if(correctCount===qs.length) ns._weaknessClear=true;
      }
      ns=awardCheck(ns,[]);
      delete ns._weaknessClear;
      return ns;
    });

    setResult({ correctCount, total:qs.length, details, passed:correctCount>=PASS, weakMode });
    setScreen("result");
  }

  /* ---------- 画面 ---------- */
  return (
    <div>
      <Sparkles/>
      {screen==="worlds" && <WorldSelect state={state} onPick={(w)=>{setCurWorld(w); setScreen("map");}} onBadges={()=>setScreen("badges")} onWeak={startWeakness}/>}
      {screen==="map" && <StageMap state={state} world={curWorld} onBack={()=>setScreen("worlds")} onStage={(s)=>startStage(curWorld,s)}/>}
      {screen==="quiz" && quizData && <Quiz data={quizData} onFinish={finishQuiz} onQuit={()=>setScreen(weakMode?"worlds":"map")}/>}
      {screen==="result" && result && <Result result={result} onRetry={()=>{ if(result.weakMode) startWeakness(); else startStage(curWorld,curStage); }} onNext={()=>{ if(result.weakMode){setScreen("worlds");return;} if(result.passed && curStage<STAGES_PER_WORLD-1) startStage(curWorld,curStage+1); else setScreen("map"); }} onMap={()=>setScreen(result.weakMode?"worlds":"map")}/>}
      {screen==="badges" && <BadgeList state={state} onBack={()=>setScreen("worlds")}/>}
      {toast && <div className="pop" style={{position:"fixed",left:"50%",bottom:28,transform:"translateX(-50%)",background:"rgba(91,74,107,.95)",color:"#fff",padding:"12px 20px",borderRadius:20,fontWeight:700,fontSize:14,zIndex:99,boxShadow:"0 8px 24px rgba(0,0,0,.25)",maxWidth:"90%",textAlign:"center"}}>{toast}</div>}
    </div>
  );
}

/* ================= ワールド選択 ================= */
function WorldSelect({state,onPick,onBadges,onWeak}){
  const cleared=totalCleared(state);
  const totalStages=WORLDS.length*STAGES_PER_WORLD;
  return (
    <div className="fade">
      <Header/>
      <StreakBar streak={state.streak}/>
      <div style={{display:"flex",gap:10,margin:"4px 0 16px"}}>
        <button className="btn" onClick={onBadges} style={{flex:1,padding:"12px",background:"linear-gradient(135deg,#ffd98a,#ffb86c)",color:"#7a5a1f",fontSize:14,boxShadow:"0 6px 16px rgba(255,184,108,.35)"}}>🏅 バッジ（{state.badges.length}/{BADGES.length}）</button>
        <button className="btn" onClick={onWeak} style={{flex:1,padding:"12px",background:"linear-gradient(135deg,#ff9ed1,#ff7fb6)",color:"#fff",fontSize:14,boxShadow:"0 6px 16px rgba(255,127,182,.35)"}}>💪 弱点克服（{[...new Set(state.wrong)].length}）</button>
      </div>
      <ProgressBar label="ぜんたいの進捗" value={cleared} max={totalStages}/>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:14}}>
        {WORLDS.map((wd,w)=>{
          const unlocked=worldUnlocked(state,w);
          const done=[...Array(STAGES_PER_WORLD).keys()].filter(s=>state.stars[`${w}-${s}`]).length;
          const isClear=done===STAGES_PER_WORLD;
          return (
            <button key={w} className="btn card" disabled={!unlocked} onClick={()=>onPick(w)}
              style={{textAlign:"left",padding:"16px 18px",opacity:unlocked?1:.55,background:`linear-gradient(135deg,${wd.g1},${wd.g2})`,position:"relative",overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:38,filter:unlocked?"none":"grayscale(1)"}}>{unlocked?wd.emoji:"🔒"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:"#8a7a9c",fontWeight:700}}>World {w+1}{isClear?" ・ ✦CLEAR✦":""}</div>
                  <div style={{fontSize:19,fontWeight:800,color:"#5b4a6b"}}>{wd.name}</div>
                  <div style={{fontSize:12,color:"#8a7a9c",marginTop:4}}>{unlocked?`${done} / ${STAGES_PER_WORLD} ステージ`:`World${w}を全クリアで解放`}</div>
                </div>
                <MiniBar value={done} max={STAGES_PER_WORLD}/>
              </div>
            </button>
          );
        })}
      </div>
      <p style={{textAlign:"center",fontSize:11,color:"#9b8aad",marginTop:22,lineHeight:1.7}}>問題出典：KA2025 / KA2026 50問クイズドリル<br/>毎日アクセスで🔥ストリークが伸びるよ！</p>
    </div>
  );
}

function Header(){
  return (
    <div style={{textAlign:"center",marginBottom:14}}>
      <div style={{fontSize:13,letterSpacing:3,color:"#b08ad6",fontWeight:700}}>✦ Aujua KA QUEST ✦</div>
      <h1 style={{margin:"4px 0 0",fontSize:30,fontWeight:900,background:"linear-gradient(90deg,#ff7fb6,#9a6cff,#52d6ad)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>KAクエスト</h1>
      <div style={{fontSize:12,color:"#9b8aad",marginTop:2}}>すごろくで楽しくKA対策 🎀</div>
    </div>
  );
}

/* ストリーク（7日サークル） */
function StreakBar({streak}){
  const n=streak.count||0;
  return (
    <div className="card" style={{padding:"12px 14px",marginBottom:12,background:"linear-gradient(135deg,#fff0f6,#f3ecff)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontWeight:800,color:"#5b4a6b",fontSize:14}}>🔥 連続学習</span>
        <span style={{fontWeight:900,color:"#ff7fb6",fontSize:16}}>{n}日</span>
      </div>
      <div style={{display:"flex",gap:6,justifyContent:"space-between"}}>
        {[...Array(7)].map((_,i)=>{ const on=i<((n-1)%7)+1 && n>0; const full=n>=7;
          return <div key={i} style={{flex:1,aspectRatio:"1",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
            background:(on||full)?"linear-gradient(135deg,#ffb86c,#ff7fb6)":"#efe6f5",color:(on||full)?"#fff":"#cbbcd9",fontWeight:700,boxShadow:(on||full)?"0 3px 8px rgba(255,127,182,.4)":"none"}}>{(on||full)?"🔥":i+1}</div>; })}
      </div>
    </div>
  );
}

function ProgressBar({label,value,max}){
  const pct=Math.round(value/max*100);
  return (
    <div style={{marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#8a7a9c",fontWeight:700,marginBottom:4}}><span>{label}</span><span>{value}/{max}（{pct}%）</span></div>
      <div style={{height:12,borderRadius:8,background:"#efe6f5",overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",borderRadius:8,background:"linear-gradient(90deg,#ff9ed1,#c9a9ff,#7fe0c2)",transition:"width .5s"}}/></div>
    </div>
  );
}
function MiniBar({value,max}){
  const pct=Math.round(value/max*100);
  return <div style={{width:46,height:46,borderRadius:"50%",background:`conic-gradient(#ff7fb6 ${pct}%, #ffffff88 ${pct}%)`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:34,height:34,borderRadius:"50%",background:"#fffafd",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#5b4a6b"}}>{pct}%</div></div>;
}

/* ================= すごろくマップ ================= */
function StageMap({state,world,onBack,onStage}){
  const wd=WORLDS[world];
  // 4列×5行の蛇行
  const rows=[]; for(let r=0;r<STAGES_PER_WORLD/4;r++){ let row=[r*4,r*4+1,r*4+2,r*4+3]; if(r%2===1) row=row.reverse(); rows.push(row); }
  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <button className="btn" onClick={onBack} style={{padding:"8px 14px",background:"#ffffffcc",color:"#8a7a9c",fontSize:13}}>← もどる</button>
        <div><div style={{fontSize:12,color:"#8a7a9c",fontWeight:700}}>World {world+1}</div><div style={{fontSize:20,fontWeight:900,color:"#5b4a6b"}}>{wd.emoji} {wd.name}</div></div>
      </div>
      <div className="card" style={{padding:"18px 14px",background:`linear-gradient(160deg,${wd.g1},${wd.g2})`,position:"relative"}}>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {rows.map((row,ri)=>(
            <div key={ri} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexDirection:ri%2?"row-reverse":"row"}}>
              {row.map(s=>{
                const unlocked=stageUnlocked(state,world,s);
                const stars=state.stars[`${world}-${s}`]||0;
                const done=stars>0;
                return (
                  <button key={s} className="btn" disabled={!unlocked} onClick={()=>onStage(s)}
                    style={{width:64,height:64,borderRadius:20,position:"relative",
                      background:done?"linear-gradient(135deg,#fff7ad,#ffd98a)":unlocked?"#fffafd":"#e9e0f0",
                      color:done?"#a06a1f":"#8a7a9c",boxShadow:unlocked?"0 6px 14px rgba(154,108,255,.25)":"none",
                      border:unlocked&&!done?"2px dashed #d9a9ff":"none",opacity:unlocked?1:.6}}>
                    <div style={{fontSize:done?18:20,fontWeight:900}}>{!unlocked?"🔒":done?"":(s+1)}</div>
                    {done && <div style={{fontSize:16,fontWeight:900,lineHeight:1}}>{s+1}</div>}
                    {done && <div style={{fontSize:9,marginTop:1}}>{"⭐".repeat(stars)}</div>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p style={{textAlign:"center",fontSize:11,color:"#9b8aad",marginTop:14}}>1ステージ {Q_PER_STAGE}問 ・ {PASS}問正解でクリア✦　⭐は正解数（7問=⭐⭐⭐）</p>
    </div>
  );
}

/* ================= クイズ ================= */
function Quiz({data,onFinish,onQuit}){
  const [i,setI]=useState(0);
  const [picked,setPicked]=useState(null);
  const [answers,setAnswers]=useState([]);
  const q=data.qs[i];

  function choose(opt){ if(picked!==null) return; setPicked(opt); }
  function next(){
    const na=[...answers,picked]; setAnswers(na); setPicked(null);
    if(i+1<data.qs.length) setI(i+1); else onFinish(na);
  }
  const catColor={[C_HAIR]:"#ff9ed1",[C_CARE]:"#7fe0c2",[C_COLOR]:"#c9a9ff",[C_SOC]:"#ffd98a"}[q.cat]||"#c9a9ff";

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <button className="btn" onClick={onQuit} style={{padding:"8px 12px",background:"#ffffffcc",color:"#8a7a9c",fontSize:13}}>✕ やめる</button>
        <span style={{fontWeight:800,color:"#5b4a6b",fontSize:13}}>{data.title}</span>
        <span style={{fontWeight:900,color:"#ff7fb6"}}>{i+1}/{data.qs.length}</span>
      </div>
      <div style={{height:8,borderRadius:6,background:"#efe6f5",overflow:"hidden",marginBottom:14}}><div style={{height:"100%",width:((i)/data.qs.length*100)+"%",background:"linear-gradient(90deg,#ff9ed1,#c9a9ff,#7fe0c2)",transition:"width .3s"}}/></div>

      <div className="card pop" style={{padding:"20px 18px",marginBottom:16}}>
        <span style={{display:"inline-block",fontSize:11,fontWeight:800,color:"#fff",background:catColor,padding:"3px 10px",borderRadius:10,marginBottom:10}}>{q.cat}</span>
        <div style={{fontSize:17,fontWeight:700,lineHeight:1.65,color:"#4a3b59"}}>{q.q}</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.opts.map((opt,k)=>{
          let bg="#fffafd",col="#5b4a6b",bd="2px solid #f0e4f7",extra=null;
          if(picked!==null){
            if(opt===q.correct){ bg="linear-gradient(135deg,#bff5df,#7fe0c2)"; col="#1f7a5a"; bd="2px solid #52d6ad"; extra="◎"; }
            else if(opt===picked){ bg="linear-gradient(135deg,#ffd2dd,#ff9eb0)"; col="#a83a52"; bd="2px solid #ff7a9a"; extra="✕"; }
            else { bg="#f6f0fa"; col="#b3a6c2"; }
          }
          return (
            <button key={k} className="btn" onClick={()=>choose(opt)}
              style={{padding:"15px 16px",textAlign:"left",fontSize:15,fontWeight:700,background:bg,color:col,border:bd,borderRadius:16,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              <span>{opt}</span>{extra&&<span style={{fontSize:18,fontWeight:900}}>{extra}</span>}
            </button>
          );
        })}
      </div>

      {picked!==null && (
        <div className="fade" style={{marginTop:16}}>
          <div style={{textAlign:"center",fontWeight:900,fontSize:18,color:picked===q.correct?"#3fb98a":"#ff7a9a",marginBottom:10}}>
            {picked===q.correct?"せいかい！ ✦":"おしい！ もう一度おぼえよう"}
          </div>
          {picked!==q.correct && <div style={{textAlign:"center",fontSize:14,color:"#5b4a6b",marginBottom:12}}>正解は <b style={{color:"#3fb98a"}}>{q.correct}</b></div>}
          <button className="btn" onClick={next} style={{width:"100%",padding:"15px",fontSize:16,color:"#fff",background:"linear-gradient(135deg,#c9a9ff,#9a6cff)",boxShadow:"0 8px 20px rgba(154,108,255,.4)"}}>{i+1<data.qs.length?"つぎの問題へ →":"結果を見る ✦"}</button>
        </div>
      )}
    </div>
  );
}

/* ================= リザルト ================= */
function Result({result,onRetry,onNext,onMap}){
  const {correctCount,total,details,passed,weakMode}=result;
  const stars=correctCount>=7?3:correctCount>=6?2:correctCount>=PASS?1:0;
  const pct=Math.round(correctCount/total*100);
  const perfect=correctCount===total;
  return (
    <div className="fade">
      <div className="card pop" style={{padding:"24px 18px",textAlign:"center",marginBottom:14,background:passed||weakMode?"linear-gradient(160deg,#fff3fa,#f1ecff)":"linear-gradient(160deg,#fff,#fbeef2)"}}>
        <div style={{fontSize:13,fontWeight:800,color:"#b08ad6"}}>{weakMode?"💪 弱点克服 結果":passed?"ステージクリア！":"もう一歩…！"}</div>
        <div style={{fontSize:46,margin:"6px 0"}}>{perfect?"🎉":passed||weakMode?"✨":"💧"}</div>
        {!weakMode && <div style={{fontSize:26,letterSpacing:2}}>{"⭐".repeat(stars)}{"☆".repeat(Math.max(0,3-stars))}</div>}
        <div style={{fontSize:34,fontWeight:900,color:"#5b4a6b",marginTop:6}}>{correctCount} / {total} <span style={{fontSize:16,color:"#9b8aad"}}>正解</span></div>
        <div style={{fontSize:14,color:"#9b8aad"}}>正答率 {pct}%　{perfect?"パーフェクト！💯":""}</div>
        {!weakMode && !passed && <div style={{fontSize:13,color:"#ff7a9a",fontWeight:700,marginTop:8}}>あと{PASS-correctCount}問でクリア！リトライしよう</div>}
      </div>

      <div className="card" style={{padding:"14px 14px",marginBottom:16}}>
        <div style={{fontWeight:800,color:"#5b4a6b",fontSize:14,marginBottom:8}}>📝 答え合わせ</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {details.map((d,k)=>(
            <div key={k} style={{borderLeft:`4px solid ${d.ok?"#52d6ad":"#ff7a9a"}`,paddingLeft:10}}>
              <div style={{fontSize:13,fontWeight:700,color:"#4a3b59",lineHeight:1.5}}>{d.ok?"⭕":"❌"} {d.q}</div>
              {!d.ok && <div style={{fontSize:12,color:"#9b8aad",marginTop:2}}>あなた: <span style={{color:"#ff7a9a"}}>{d.picked||"未回答"}</span> ／ 正解: <b style={{color:"#3fb98a"}}>{d.correct}</b></div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:10}}>
        <button className="btn" onClick={onRetry} style={{flex:1,padding:"15px",fontSize:15,color:"#8a5acc",background:"#fff",border:"2px solid #d9c2ff"}}>🔄 もう一度</button>
        {!weakMode && passed
          ? <button className="btn" onClick={onNext} style={{flex:1.4,padding:"15px",fontSize:15,color:"#fff",background:"linear-gradient(135deg,#7fe0c2,#52d6ad)",boxShadow:"0 8px 20px rgba(82,214,173,.4)"}}>つぎのステージ →</button>
          : <button className="btn" onClick={onMap} style={{flex:1.4,padding:"15px",fontSize:15,color:"#fff",background:"linear-gradient(135deg,#c9a9ff,#9a6cff)",boxShadow:"0 8px 20px rgba(154,108,255,.4)"}}>{weakMode?"ワールドへ":"マップへ"}</button>}
      </div>
    </div>
  );
}

/* ================= バッジ一覧 ================= */
function BadgeList({state,onBack}){
  const have=new Set(state.badges);
  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <button className="btn" onClick={onBack} style={{padding:"8px 14px",background:"#ffffffcc",color:"#8a7a9c",fontSize:13}}>← もどる</button>
        <h2 style={{margin:0,fontSize:22,fontWeight:900,color:"#5b4a6b"}}>🏅 バッジコレクション</h2>
      </div>
      <ProgressBar label="獲得バッジ" value={have.size} max={BADGES.length}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
        {BADGES.map(b=>{ const got=have.has(b.id);
          return (
            <div key={b.id} className="card" style={{padding:"16px 12px",textAlign:"center",background:got?"linear-gradient(160deg,#fff7e6,#ffe9c2)":"#f4eef9",opacity:got?1:.7}}>
              <div style={{fontSize:40,filter:got?"none":"grayscale(1) opacity(.5)"}}>{got?b.icon:"🔒"}</div>
              <div style={{fontSize:14,fontWeight:800,color:"#5b4a6b",marginTop:6}}>{b.name}</div>
              <div style={{fontSize:11,color:"#9b8aad",marginTop:3,lineHeight:1.4}}>{b.desc}</div>
              {got && <div style={{fontSize:10,fontWeight:800,color:"#e0913a",marginTop:5}}>✦ GET! ✦</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
