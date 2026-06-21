export type AboutSectionId = "intro" | "philosophy" | "organization" | "vision";

export interface AboutSection {
  id: AboutSectionId;
  label: string;
  html: string;
}

export const ABOUT_SECTION_MARKERS: Record<AboutSectionId, string> = {
  intro: "intro",
  philosophy: "philosophy",
  organization: "organization",
  vision: "vision",
};

/** 內建內容（docx 整理）；WordPress 有標記區塊時以後台為準 */
export function getDefaultAboutSections(orgImageUrl = "/about/org-structure.jpg"): AboutSection[] {
  return [
    {
      id: "intro",
      label: "社團介紹",
      html: `
        <p class="about-lead">臺中市蔬食台灣促進會<br /><span class="about-subtitle">VegeTaiwan Promotion Association, VTPA</span></p>
        <p>本會於中華民國109年8月16日第一屆第一次會員大會通過，報經臺中市政府社會局109年8月25日中市社團字第1090097461號函准予備查。</p>
        <h3>協會宗旨</h3>
        <p>本會為依法設立、非以營利為目的之社會團體，以鼓勵推動台灣「全民蔬食」為宗旨，弘揚維根（Vegan）精神與文化。未來理想著重發展「蔬食經濟」與「純素旅遊觀光」，讓台灣站在世界道德的制高點，將「愛心台灣」成為世界的新標章。</p>
        <blockquote class="about-quote">台灣第一，不是夢！<br />蔬食台灣！<br />台灣新生活運動！</blockquote>
        <h3>協會活動內容</h3>
        <h4>一、安排推廣蔬食演講工作</h4>
        <p>安排講師演講，深入社區、學校、企業與公家機關傳遞蔬食環保理念。</p>
        <h4>二、蔬食推廣的實務活動</h4>
        <ol>
          <li>由葷轉素相關的活動及資訊服務：21日蔬食體驗營活動</li>
          <li>蔬食資訊搜集、整合及文章發表</li>
          <li>舉辦研討會：針對特定的議題作廣泛深入的理解與討論</li>
          <li>舉辦各類型的讀書會：宣導理念及意見交流</li>
          <li>與外界蔬食友善團體合作</li>
        </ol>
        <h4>三、網紅教學與發展工作</h4>
        <p>自媒體是現階段最具有效率的推廣工具，透過短視頻的播放可以有效吸引大眾的關注，達到推廣蔬食的效果。</p>
        <ol>
          <li>成立官網、YouTube、Facebook 等社群平台：建立蔬食資訊平台，發表最新正確的蔬食資訊，解釋大眾的疑慮與偏見</li>
          <li>透過讀書會進行自媒體教學，培養推廣人才</li>
          <li>各種蔬食推廣、緊急呼籲、可愛動物等視頻蒐集</li>
          <li>大數據搜集（由葷轉素的關鍵因素分析）</li>
        </ol>
      `,
    },
    {
      id: "philosophy",
      label: "社團的理念",
      html: `
        <h3>社團成立的理念說明</h3>
        <h4>黎明前的黑暗</h4>
        <p>我們會員來自社會各階層，平時各安其位做自己的工作，基於共識，也經常聚會關心各類環保議題及推廣純素（Vegan）活動。十年前即開始投入活動，安排數百場社會各層面的環保演講，包括社區、學校、企業、公家機關等各單位，足跡遍佈全台灣，也讓聯合國不斷對世界發佈氣候變遷的呼籲訊息，有效的傳遞給社會大眾知悉。</p>
        <p>當然我們深諳理解落實「環保減碳」與發展「民生經濟」間存在著相當的糾結，也清楚為政者的為難，然而十年來持續嚴峻的溫室氣體排放，世界生態及各種極端氣候異象已經給出了不可逆轉的警訊。縱使聯合國訂定了環境永續指標17項目，在持續現實面的「糾結」與有權力者「為難」的情況下，我們對未來環境改善能有多少期待？眼巴巴望著逐年攀伸的曲線及一口長歎，對後世代的子民如何做交代？我們確實失能與失職了！</p>
        <p>在台灣，與前述同理想理念的團體及個人非常多，各執所長、殫精竭力、奔走推廣、不餘遺力，然而客觀審視後，彼此間未能充分整合及本位主義前提下，外加前述公權力的「糾結」與「為難」現實條件後，不是化為一抹煙塵，就是呈形一尊供人參拜的偶像或圖騰，只剩下定期與大眾結緣的功能，了無它趣。</p>
        <h4>曙光乍現</h4>
        <p>1929年經濟大蕭條後，凱恩斯經濟理論因此騰空而出，也成為世界經濟運作的主流，確實也帶來地球人類前所未有的繁榮。然而從2008年全球金融風暴後，也開始理解這樣的經濟運行系統似乎也不理想，終究還是出了問題。此次疫情不也充分暴露了這些的漏洞，貧富差距更加深了這嚴峻程度。</p>
        <p>因此我們刻意不再使用自由、民主、繁榮這些名詞成為一個文明社會的旗幟標竿（雖然也很重要），但一個安全、公平、正義、祥和的人類社會才應該是王道，也是人類生存最大的公約數。如果真有外地文明的話，相信這才會是高等級文明族群的屬性。</p>
        <p>「說得容易，但如何做到？」是的，這真是個難題！我們思考過，任何的社會創新理念若牽動前述所提到的「糾結」就難了！要說服有權力者概念的改變也必須要讓他們「不為難」才行啊！基於這兩個原則，我們只要有機會就做拜訪及不厭其煩的理念說明，或許能為台灣做些真正有價值意義的事，這也是我們最大的期望。</p>
      `,
    },
    {
      id: "organization",
      label: "社團組織",
      html: `
        <p class="about-lead">臺中市蔬食台灣促進會組織架構</p>
        <figure class="about-org-chart">
          <img src="${orgImageUrl}" alt="臺中市蔬食台灣促進會組織圖" loading="lazy" />
        </figure>
        <div class="about-org-list">
          <div class="about-org-item"><span>會員大會</span></div>
          <div class="about-org-item"><span>理監事會</span></div>
          <div class="about-org-item"><span>理事長</span></div>
          <div class="about-org-item"><span>總幹事</span></div>
          <div class="about-org-grid">
            <div class="about-org-item"><span>財務組</span></div>
            <div class="about-org-item"><span>文書策劃組</span></div>
            <div class="about-org-item"><span>總務組</span></div>
            <div class="about-org-item"><span>公關組</span></div>
          </div>
        </div>
      `,
    },
    {
      id: "vision",
      label: "願景",
      html: `
        <h3>台灣第一，不是夢！</h3>
        <p>台灣是一座美麗的島，無數先人篳路藍縷、揮灑血汗，為的就是要植栽夢想在這塊土地上，期盼她日後成長茁壯、出人頭地。同一屋簷下或有些許歧異、有些許爭吵，但彼此愛家的心都是不變的。但曾幾何時，記憶中的山川美景已不復見，僅見大雨過後的土石流及無一倖免的河川汙染，不禁傷心地捫心自問：我們真的愛她嗎？</p>
        <p>我們有辛勤善良的百姓、宜人的氣候、肥沃的土壤及各種傲人的植栽技術，最重要的，是我們社會有密度相當高的蔬食餐飲及人口（世界排名第一），若推廣「全民蔬食運動」要比世界任何其他國家來得容易。在這世界「環保減碳」口號震天價響的氛圍裡，「蔬食減碳」又是其中最有效的作為，何妨台灣就以「全民蔬食」作為國策，大力向國人訴求推動。</p>
        <p>除能向全世界展現「環保減碳」之積極作為，更能將台灣塑造形成舉世注目的「蔬食環保國度」，不僅能穩站世界道德層面的制高點，以建立良好形象，更能發展出特有的觀光資源以助益國內經濟。</p>
        <h4>建議做法</h4>
        <ul>
          <li>時值美豬進口之際，不妨訂出獎勵辦法，實質鼓勵畜牧業者轉型，同時也能讓台灣流水生態都能恢復生機，美化環境。</li>
          <li>重新規劃闢建好山好水的蔬食旅遊環境，吸引國際觀光客，塑造出台灣環保國度之新形象。</li>
          <li>鼓勵並獎勵工商團體全面供應蔬食餐飲給員工，對於蔬食推廣有實質效益的工業廠商給予鼓勵。</li>
          <li>誘導現階段從事葷食行業轉業！該部份的工作較為複雜，也必會面臨不小的壓力，因此須以循序漸進的方式，不斷透過獎勵或全面媒體宣導，讓台灣足夠的人民接受「蔬食減碳」概念。</li>
        </ul>
        <p class="about-closing">制定踏實的政策還需專家群策群力才行，但台灣既已具良好之基礎，何不將「全民蔬食」納入政策推行，這不僅是社會創新的一環，也將會是地球人類有歷史以來最展新的「新生活運動」，也將會給世界帶來典範。</p>
      `,
    },
  ];
}

export function buildAboutPageHtml(orgImageUrl = "/about/org-structure.jpg"): string {
  const sections = getDefaultAboutSections(orgImageUrl);
  return sections
    .map(
      (section) =>
        `<section data-vege-about-section="${section.id}">\n${section.html.trim()}\n</section>`
    )
    .join("\n\n");
}
