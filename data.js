/* Meri Kahani, Meri Zubani — seed content.
   The six profiles below are written from the team's field interviews in Sanquelim, Goa
   (interviewers: Sneha, Ravi, Parth). Quotes are taken from the transcripts. */

window.AK = window.AK || {};

AK.categories = [
  { id: "shop",     name: "Shop & kirana",       hi: "दुकान",   color: "#1E5B3C", motif: "jar" },
  { id: "market",   name: "Market vendors",      hi: "बाज़ार",   color: "#B3261E", motif: "basket" },
  { id: "craft",    name: "Tailoring & craft",   hi: "सिलाई",   color: "#1C6BA0", motif: "needle" },
  { id: "food",     name: "Food & drinks",       hi: "खाना",    color: "#C76A12", motif: "glass" },
  { id: "beauty",   name: "Beauty & wellness",   hi: "सौंदर्य",  color: "#B5195E", motif: "mirror" },
  { id: "shg",      name: "SHG & collectives",   hi: "समूह",    color: "#6B4E16", motif: "hands" },
  { id: "money",    name: "Money & loans",       hi: "पैसा",    color: "#2F6E5A", motif: "coin" },
  { id: "learning", name: "Tips & learning",     hi: "सीख",     color: "#7A3E8E", motif: "lamp" }
];

AK.interviewers = {
  sneha: { name: "Sneha", role: "Field interviewer" },
  ravi:  { name: "Ravi",  role: "Field interviewer" },
  parth: { name: "Parth", role: "Field interviewer" }
};

AK.women = [
  {
    id: "sunita",
    name: "Sunita Swar",
    trade: "General store",
    place: "Sanquelim",
    category: "shop",
    years: "10 years",
    since: 2016,
    shg: "Ravalnath SHG",
    loans: "None taken",
    plans: "Not expanding",
    interviewers: ["parth"],
    photo: null,
    motif: "jar",
    title: "Ten years behind the counter",
    dek: "The Ravalnath self-help group came to Sunita when she needed money. A decade later, her general store is still open in Sanquelim.",
    quote: "The self help group supported me in setting up this business.",
    story: [
      "Sunita Swar's general store has been part of Sanquelim's daily routine for ten years. It began with a gap she could not fill on her own: she needed money to set up shop, and she did not have it.",
      "The help came from her own neighbourhood. The Ravalnath self-help group approached her and backed the business when it was still an idea. “I needed financial support so the SHG approached me,” she told Parth. She has not needed a bank loan or a government scheme since.",
      "Asked about trouble while setting up, her answer was the same each time: none. In a field full of stories about paperwork and refusals, Sunita's is about what happens when credit comes from people who already know you.",
      "Today she is clear about where she stands. “I have come of age now, so I do not wish to expand.” Not every business has to grow to count. Some exist to keep a household steady and a street supplied, and hers has done that for a decade."
    ],
    lessons: [
      "An SHG can be the first lender when a bank feels out of reach.",
      "Choosing not to expand is a valid business decision."
    ],
    transcript: [
      ["Parth", "Are you part of any self help group?"],
      ["Sunita", "Ravalnath SHG."],
      ["Parth", "So why did you start with your shop?"],
      ["Sunita", "The self help group supported me in setting up this business. I needed financial support so the SHG approached me."],
      ["Parth", "Have you taken any loans or govt schemes?"],
      ["Sunita", "No."],
      ["Parth", "Do you want to expand your business?"],
      ["Sunita", "No, I have come of age now so I do not wish to expand."]
    ]
  },
  {
    id: "pooja",
    name: "Pooja",
    trade: "Vegetable seller",
    place: "Keri",
    category: "market",
    years: "18 years",
    since: 2008,
    shg: "Not a member",
    loans: "One loan at the start, then municipal support",
    plans: "Planning to expand",
    interviewers: ["parth"],
    photo: "img/pooja.jpg",
    photoAlt: "Pooja seated at her vegetable stall in the covered market, with bundles of red amaranth and ivy gourd in front of her",
    motif: "basket",
    title: "Eighteen years of morning greens",
    dek: "When there was no other earner at home, Pooja became one. She now sells around ₹2,000 of vegetables a day and wants to grow.",
    quote: "I didn’t have a bread earner in my household.",
    story: [
      "Under the canvas sheets of the market, Pooja sits among bundles of red amaranth, ivy gourd and brinjal. She has been doing this for eighteen years.",
      "She started because someone had to. “I didn’t have a bread earner in my household. My husband doesn’t have a job,” she told Parth. The stall became the household's income, and Pooja became the person who decides how that money is spent.",
      "She took a loan at the beginning. After that, support came from the municipality. She is not part of a self-help group. Most of her stock travels a long way to reach her, from Mayem and from Dodamarg across the border.",
      "On a typical day she sells about ₹2,000 worth of vegetables. Asked whether she has thought about expanding, her answer was quick: “Yes, we are thinking of expanding.” After eighteen years at the same spot, she is still planning ahead."
    ],
    lessons: [
      "Street vendors can use PM SVANidhi working-capital loans that grow with each repayment.",
      "Long supply routes (Mayem, Dodamarg) are a cost worth tracking. Pooling transport with other vendors can cut it."
    ],
    transcript: [
      ["Parth", "So how many years have you been running your vegetable business?"],
      ["Pooja", "I have been running it for 18 years."],
      ["Pooja", "I didn’t have a bread earner in my household, my husband doesn’t have a job."],
      ["Parth", "So do you decide how the money is spent?"],
      ["Pooja", "Yes."],
      ["Parth", "Have you taken any loan or govt. scheme?"],
      ["Pooja", "Yes, I did take a loan in the beginning, after that I was supported by the municipality."],
      ["Parth", "So how much is the worth of the vegetables that you sell per day?"],
      ["Pooja", "It is around 2000 rs."],
      ["Parth", "So where do you procure your vegetables?"],
      ["Pooja", "We procure this from far off places like Mayem, Dodamarg etc."]
    ]
  },
  {
    id: "bilkis",
    name: "Bilkis",
    trade: "Tailor",
    place: "Sanquelim",
    category: "craft",
    years: "Since 1986",
    since: 1986,
    shg: "Afreen SHG (10 members)",
    loans: "Three loans through the SHG",
    plans: "Not expanding",
    interviewers: ["sneha", "ravi"],
    photo: null,
    motif: "needle",
    title: "Since 1986, one stitch at a time",
    dek: "Bilkis started learning to sew at fourteen. Her ten-woman SHG pools money every few months and has lent to her three times.",
    quote: "You can pay in smaller installments if you are in a weaker financial condition.",
    story: [
      "Bilkis did not plan a tailoring business. She started learning to sew at fourteen, became good at it, and in 1986 the skill became her work. She has been at it in Sanquelim ever since.",
      "The hard part, she says, came early. “I didn’t have much issues while conducting [the business]. It was mainly during learning tailoring.”",
      "What keeps her steady is the Afreen self-help group. Ten women, each running a different business, pool money every four to six months and lend from it. Bilkis has borrowed three times, and each time it was easy. When Ravi asked about repayment, she explained the group's flexibility: members going through a weak patch can pay in smaller instalments.",
      "She decides where her money goes, and she has a rule for it: half gets invested, “because we get returns from it.” She has no plans to expand. Her household expenses are covered, and for Bilkis that is the point of the business."
    ],
    lessons: [
      "A small SHG with regular pooling can lend faster and more flexibly than a bank.",
      "A fixed rule, such as investing half of what you earn, builds savings without daily decisions."
    ],
    transcript: [
      ["Sneha", "How long have you been in the tailoring business?"],
      ["Bilkis", "I have been here for 30 years, I started in 1986. I have started learning tailoring since 14 years old so I became good at it."],
      ["Sneha", "So how did [the SHG] help you?"],
      ["Bilkis", "There are 10 of us, each having a different business, they help each of us financially by pooling money every 4 or 6 months."],
      ["Ravi", "So are the payment terms flexible?"],
      ["Bilkis", "Yes, the payment terms are flexible. You can pay in smaller installments if you are in a weaker financial condition."],
      ["Sneha", "So do you decide where to spend the money?"],
      ["Bilkis", "I do, we invest half of the amount because we get returns from it."]
    ]
  },
  {
    id: "shree",
    name: "Shree Cold Drinks",
    trade: "Snacks & cold drinks",
    place: "Sanquelim",
    category: "food",
    years: "6 years",
    since: 2020,
    shg: "Not a member",
    loans: "None; funded from the earlier grocery business",
    plans: "Not expanding",
    interviewers: ["sneha"],
    photo: null,
    motif: "glass",
    owner: "She runs it with her husband, Shivprasad, who spoke for them",
    toldBy: "She preferred not to speak, so her husband, Shivprasad, answered for her.",
    title: "From grocery shelves to lassi glasses",
    dek: "She hesitated to speak, so her husband told their story: a grocery turned into an eating spot where most customers now pay online.",
    quote: "Our day ends very late and you have to prepare for the following day.",
    story: [
      "When we reached Shree Cold Drinks, the woman behind the counter hesitated to be interviewed. She asked her husband, Shivprasad, to answer for both of them. So this is her business, told in his words.",
      "The shop is a two-person operation, and Shivprasad is past fifty. Six years ago the couple were running a grocery. Then they were relocated out of the municipal area, and the market around them had changed. They decided to open an eating spot instead.",
      "They paid for the switch with savings from the grocery and took no loan. Today the counter sells samosas, patties, lassis and shakes, and people come from Bicholim and Keri, not just Sanquelim. Most of them pay by UPI.",
      "Profits mostly go back into the shop: more crates, more stock. Sales peak in the hot months from December onward. Vendors deliver supplies from Bicholim and Valpoi. Their only marketing is word of mouth, which rests on good service.",
      "The work is long. “Our day ends very late, and you have to prepare for the following day by cleaning up the place, getting supplies.” Competition is rising too. There are no expansion plans. Their children have gone into engineering, so for now the shop is the couple's own.",
      "We hope she tells the next part herself. That is what this platform is for: a written post or a voice note, in her own words, whenever she is ready."
    ],
    lessons: [
      "If speaking to strangers feels uncomfortable, a written post or a voice note on this site lets a woman tell her story on her own terms.",
      "Moving to UPI early makes daily accounts easier and builds a record that banks can read.",
      "Plan stock and helpers around the December to May peak."
    ],
    transcript: [
      ["Sneha", "So why did you think of shifting businesses?"],
      ["Shivprasad", "Mainly because of the market and so we decided to open an eating spot."],
      ["Sneha", "So do the customers generally do cash payments or online?"],
      ["Shivprasad", "Mostly it is online payments."],
      ["Sneha", "So which months do you have better sales?"],
      ["Shivprasad", "Mainly during summers. Generally you can say, December onwards."],
      ["Sneha", "So how do you do marketing for your business?"],
      ["Shivprasad", "Mainly through word of mouth. Due to good service, many people visit us."]
    ]
  },
  {
    id: "traders",
    name: "The New Market Traders",
    trade: "Steel & plastic utensils",
    place: "Amona village, Bicholim taluka",
    category: "shop",
    years: "Since the 1970s",
    since: 1975,
    shg: "Not a member",
    loans: "Bank loans plus help from family",
    plans: "Continuing as is",
    interviewers: ["ravi", "sneha"],
    photo: "img/traders.jpg",
    photoAlt: "The trading family standing with two interviewers in front of their utensil shop under a green New Market signboard",
    motif: "pot",
    owner: "The women of the family asked the 71-year-old founder to speak for them",
    toldBy: "The women of the family preferred not to speak, so the 71-year-old founder answered for them.",
    title: "After the flood, steel",
    dek: "The women who keep this shop running asked the founder to do the talking. He told us how the family lost ₹5 lakh in the 1996 flood and rebuilt.",
    quote: "The most challenging part is having capital.",
    story: [
      "The green signboard at New Market belongs to a family from Amona village in Bicholim taluka. The women of the family stood with us at the counter, but when the questions began they hesitated and asked the founder, now 71, to answer. What follows is the family's story in his words.",
      "The family has been in business since the 1970s, and the shop has not always sold utensils.",
      "It used to be a paint shop. In 1996, water from the dams overflowed into Sanquelim and the family lost about ₹5 lakh. They started again with steel and plastic utensils. One reason, the founder told Ravi, is that this stock lasts, unlike grain.",
      "Money was always the hardest part. “My parents were farmers and it was difficult for us to raise capital.” The family managed with some loans and help from his father and brother. A government offer of loans at 4% interest never reached them. Repaying loans, he says, is hard.",
      "Quality is checked in person. Rather than trust an order, the family sometimes travels to Belgaum to inspect stock before buying. At 71, the founder has no plans to expand: “I will continue like this.” The women of the family keep the counter going every day."
    ],
    lessons: [
      "Women who keep a family shop running are business owners too. Their names belong on the loan papers, the Udyam certificate and the SHG register.",
      "Insure stock against flood and fire. Udyam-registered units can ask their bank about MSME insurance cover.",
      "If a promised scheme never arrives, ask the bank branch or district industries centre directly. The same scheme may be available there."
    ],
    transcript: [
      ["Ravi", "What is your main motivation for starting your business?"],
      ["Trader", "Earlier I had a paint shop. Then there was a massive flood in 1996 in Sanquelim in which the water from the dams had overflown. So I suffered a loss of 5 lakhs after which I decided to start this."],
      ["Sneha", "What is the most challenging part?"],
      ["Trader", "The most challenging part is having capital. My parents were farmers and it was difficult for us to raise capital."],
      ["Sneha", "So did you go for any govt. schemes?"],
      ["Trader", "No, previously the govt. had assured to help but didn’t take any action."],
      ["Sneha", "Do you procure your stuff or do you have a distributor?"],
      ["Trader", "Sometimes we go to Belgaum to bring it, because if we give an order sometimes they do not give good quality, hence I check it myself before buying."]
    ]
  },
  {
    id: "harshala",
    name: "Harshala Kadam",
    trade: "Beauty parlour",
    place: "Surla (works in Sanquelim)",
    category: "beauty",
    years: "Since the pandemic",
    since: 2021,
    shg: "Not a member (local SHGs take only villagers)",
    loans: "Applying for the EDC scheme; family once pledged gold",
    plans: "Start a training course within a year",
    interviewers: ["sneha"],
    photo: "img/harshala.jpg",
    photoAlt: "Harshala Kadam in her parlour, standing beside two interviewers who are writing in a notebook",
    motif: "mirror",
    title: "The parlour she didn't plan",
    dek: "Harshala wanted to teach history. At 22 she runs a parlour on her own and plans to train others before she expands.",
    quote: "Before expanding I am planning of keeping a course of teaching others.",
    story: [
      "Harshala Kadam is 22, and she did not choose the beauty business. She wanted to be a history teacher, but there were few seats for general-category students and the path closed. Her mother, who loved makeup and had watched parlours spread across Goa, pushed her toward this work instead. Harshala trained in Class 11, during the pandemic.",
      "Her family is from Surla, and that matters. When Sneha asked about self-help groups, Harshala explained that the local SHGs only take women native to the village. As an outsider, she runs the parlour alone. Suppliers come late, so she often goes to Bicholim herself to buy stock. Festival season brings more customers than one person can handle.",
      "Her plan starts with teaching. Within a year she wants to run a course and train other women, so that she has skilled hands before she expands. She knows about the EDC scheme and is collecting documents. She does not need a loan right now. Her certificates are in order and only her licence is pending.",
      "She also remembers the hard way of raising money: “Earlier we had to mortgage our gold to obtain funds.” Her plan is built so she won't have to do that again."
    ],
    lessons: [
      "Women outside a village SHG can form a new group with other women. Ask the block office or the state livelihood mission.",
      "Training helpers first, as Harshala plans, solves the festival rush and adds a second income."
    ],
    transcript: [
      ["Sneha", "So how did you get interested in starting this business?"],
      ["Harshala", "I wasn’t interested in this. My mother wanted me to go in this profession because she was fond of makeup… I personally wanted to become a history teacher."],
      ["Sneha", "Are you aware of any govt. scheme for helping in running the business?"],
      ["Harshala", "Yes, I am aware of the EDC scheme that the govt. is providing. Currently, I am gathering documents for being ready to avail it."],
      ["Sneha", "Are you part of any SHG?"],
      ["Harshala", "No, because the local SHGs want native people from within the village to be part of it but we have come from a different village."],
      ["Sneha", "So what are your future plans?"],
      ["Harshala", "Currently I am handling it alone but before expanding I am planning of keeping a course of teaching others how to do it. I am planning of doing this within one year."]
    ]
  }
];

/* Guidance for the women. Scheme figures checked in November 2026 against PIB, scheme portals and bank pages.
   Each answer ends with where to go. Rules change, so the page tells readers to confirm at the bank or office. */
AK.faq = [
  {
    id: "scale",
    group: "Growing your business",
    q: "How do I grow my business without taking a big risk?",
    keys: ["scale", "grow", "expand", "badha", "bada", "growth", "increase sales", "more customers"],
    a: [
      "Grow in small steps you can afford to undo:",
      "<ul><li><b>Know your numbers first.</b> Write down daily sales and costs for one month in a notebook or a free app like Khatabook. You can't grow what you don't measure.</li><li><b>Sell more to the customers you already have.</b> Add one item they ask for, like Shree Cold Drinks adding shakes beside samosas.</li><li><b>Plan for your peak season.</b> Stock up and arrange extra help before festivals or summer.</li><li><b>Train a helper</b> before you open a second counter. Harshala plans to teach a course first.</li><li><b>Go digital.</b> A UPI QR code, a WhatsApp Business catalogue and a free Google Business Profile bring customers from the next village.</li><li><b>Borrow only for things that earn.</b> Use loans for stock or equipment, not household costs.</li></ul>"
    ],
    where: "Ask your SHG's book-keeper or the District Industries Centre for a free business-plan check."
  },
  {
    id: "loan-steps",
    group: "Loans",
    q: "How do I apply for a business loan?",
    keys: ["apply loan", "loan kaise", "how to get loan", "bank loan", "karz", "karza", "loan apply", "loan"],
    a: [
      "<ol><li><b>Decide the amount and use</b>, for example ₹40,000 for a sewing machine and cloth.</li><li><b>Register on Udyam</b> (free) to get an MSME certificate.</li><li><b>Pick the scheme that fits</b>: Mudra for most small shops, SVANidhi for street vendors, PMEGP if you want a subsidy, Stand-Up India for bigger new units, CMRY in Goa.</li><li><b>Gather documents</b> (see the document checklist).</li><li><b>Apply</b> at your bank branch, online through JanSamarth (jansamarth.in), or through your SHG.</li><li><b>Keep every receipt and repay on time.</b> A good repayment record makes the next, bigger loan easier.</li></ol>"
    ],
    where: "Any bank branch, jansamarth.in, or your SHG."
  },
  {
    id: "mudra",
    group: "Loans",
    q: "What is a Mudra loan and how much can I get?",
    keys: ["mudra", "shishu", "kishore", "tarun", "pmmy", "collateral free", "without guarantee"],
    a: [
      "Pradhan Mantri Mudra Yojana gives <b>collateral-free</b> loans to small non-farm businesses: shops, tailoring, parlours, food stalls and trading.",
      "<ul><li><b>Shishu</b>: up to ₹50,000</li><li><b>Kishore</b>: ₹50,000 to ₹5 lakh</li><li><b>Tarun</b>: ₹5 lakh to ₹10 lakh</li><li><b>Tarun Plus</b>: ₹10 lakh to ₹20 lakh, only if you have fully repaid an earlier Tarun loan</li></ul>",
      "No property or gold needs to be pledged."
    ],
    where: "Apply at a bank, small finance bank or MFI branch, or online at jansamarth.in / udyamimitra.in."
  },
  {
    id: "svanidhi",
    group: "Loans",
    q: "I sell on the street or in the market. Is there a loan for me?",
    keys: ["svanidhi", "street vendor", "vendor", "thela", "market seller", "vegetable", "sabzi", "hawker"],
    a: [
      "Yes. <b>PM SVANidhi</b> gives collateral-free working-capital loans in three steps:",
      "<ul><li>First loan: up to <b>₹15,000</b></li><li>Second loan: up to <b>₹25,000</b> after you repay the first</li><li>Third loan: up to <b>₹50,000</b></li></ul>",
      "On-time repayment earns a 7% interest subsidy, digital payments earn cashback, and after the second loan you can get a UPI-linked RuPay credit card. The scheme runs until 31 March 2030. Vendors from nearby villages who sell inside town limits can apply with a letter of recommendation from the municipality."
    ],
    where: "pmsvanidhi.mohua.gov.in, or ask your municipal council office (as Pooja did)."
  },
  {
    id: "pmegp",
    group: "Government schemes",
    q: "Is there a scheme that pays part of my project cost?",
    keys: ["subsidy", "pmegp", "kvic", "margin money", "free money", "grant"],
    a: [
      "<b>PMEGP</b> is a bank loan plus a government subsidy for <b>new</b> units.",
      "<ul><li>Women count as a special category: you put in only <b>5%</b>.</li><li>The subsidy is <b>35%</b> of project cost in rural areas and 25% in urban areas.</li><li>Project cost up to <b>₹50 lakh</b> for manufacturing and <b>₹20 lakh</b> for service or business units.</li><li>Only one person per family can apply.</li></ul>",
      "Example: for a ₹4 lakh rural tailoring unit, you put in ₹20,000 and the subsidy covers about ₹1.4 lakh of the bank loan."
    ],
    where: "Apply online on the KVIC PMEGP portal (kviconline.gov.in), or ask at the District Industries Centre."
  },
  {
    id: "standup",
    group: "Government schemes",
    q: "What is Stand-Up India?",
    keys: ["stand up", "standup", "stand-up", "1 crore", "big loan", "greenfield"],
    a: [
      "Stand-Up India supports <b>women</b> and SC/ST entrepreneurs with bank loans of <b>₹10 lakh to ₹1 crore</b> to start a <b>new</b> (first-time) enterprise in manufacturing, services, trading or agri-allied work.",
      "Every bank branch should lend to at least one woman borrower under it. Repayment can run up to 7 years with up to 18 months' moratorium. The scheme has been extended until 31 March 2031."
    ],
    where: "Any scheduled commercial bank branch, or standupmitra.in."
  },
  {
    id: "goa-edc",
    group: "Government schemes",
    q: "What help does the Goa government give (EDC / CMRY)?",
    keys: ["goa", "edc", "cmry", "rojgar", "chief minister", "state scheme", "swayam rojgar"],
    a: [
      "The <b>Economic Development Corporation (EDC)</b> runs the Chief Minister's Rojgar Yojana (CMRY), a self-employment loan for Goan residents. It funds projects up to about <b>₹25 lakh</b>, with interest rebates and extra benefits for women. Applicants must meet residence, age and education rules.",
      "The state has also launched the <b>Mukhyamantri Swayam Rojgar Yojana</b>, with low-interest loans and special incentives for women entrepreneurs. Both go through EDC, the office Harshala is preparing her documents for."
    ],
    where: "EDC Ltd, EDC House, Dr. A.B. Road, Panaji. Phone 0832-2224510. Forms are on edc-goa.com."
  },
  {
    id: "shg-join",
    group: "Self-help groups",
    q: "How do I join or start a self-help group (SHG)?",
    keys: ["shg", "self help", "group", "samuh", "bachat gat", "join group", "start group", "native", "outsider"],
    a: [
      "An SHG is usually 10 to 20 women from similar backgrounds who save a fixed amount every month and lend to each other. Bilkis's Afreen SHG has 10 members.",
      "<ul><li>If the local group won't take you, which happened to Harshala, <b>start a new one</b> with other women in your ward or market.</li><li>Open a group savings account, keep minutes and save regularly for a few months.</li><li>Then ask to be linked to <b>DAY-NRLM</b> (the national rural livelihood mission) through the block office.</li></ul>"
    ],
    where: "Block Development Office, or the District Rural Development Agency (DRDA)."
  },
  {
    id: "shg-loans",
    group: "Self-help groups",
    q: "What loans can an SHG get?",
    keys: ["shg loan", "nrlm", "lakhpati", "lakhpati didi", "community investment", "group loan"],
    a: [
      "Under DAY-NRLM, banks can lend SHGs up to <b>₹20 lakh without collateral</b>. Groups can also get a Community Investment Fund of up to ₹2.5 lakh, and interest subvention on smaller loans.",
      "The <b>Lakhpati Didi</b> initiative helps SHG members reach a household income of ₹1 lakh a year or more, through skills training and enterprise support.",
      "Individual members can also take their own Mudra loan."
    ],
    where: "Your SHG's bank branch, or lakhpatididi.gov.in."
  },
  {
    id: "documents",
    group: "Paperwork",
    q: "Which documents do I need for a loan?",
    keys: ["documents", "papers", "kagaz", "kaagaz", "aadhaar", "pan", "kyc", "proof", "checklist"],
    a: [
      "<ul><li>Aadhaar card and PAN card</li><li>Passport-size photos</li><li>Bank passbook or last 6 months' statement</li><li>Address proof for home and shop</li><li>Udyam registration certificate</li><li>A short business plan: what you sell, monthly sales, what the loan buys</li><li>Quotations for machines or stock you will buy</li><li>Caste or residence certificate, if a scheme asks for it</li><li>Shop licence or FSSAI registration, if you have one</li></ul>",
      "Make two photocopies of everything and keep the originals in a plastic folder."
    ],
    where: "Your bank branch will give a final list for the scheme you choose."
  },
  {
    id: "udyam",
    group: "Paperwork",
    q: "What is Udyam registration and why should I do it?",
    keys: ["udyam", "msme", "registration", "register business", "certificate"],
    a: [
      "Udyam registration is the government's free online certificate for small businesses. You need only your Aadhaar and PAN. It makes it easier to get priority-sector loans, scheme subsidies and government tenders. There is no fee, so avoid agents who charge for it."
    ],
    where: "udyamregistration.gov.in"
  },
  {
    id: "licence",
    group: "Paperwork",
    q: "Which licences does a small shop need?",
    keys: ["licence", "license", "permit", "fssai", "trade license", "shop act", "food license"],
    a: [
      "<ul><li><b>Trade licence</b> from your municipal council or panchayat, for most shops and parlours.</li><li><b>FSSAI registration</b> if you sell food or drinks, like Shree Cold Drinks.</li><li><b>Shop and establishment registration</b> under your state's rules.</li><li><b>GST</b> only once your yearly turnover crosses the limit. Check with an accountant.</li></ul>",
      "Harshala's certificates are ready and only her licence is pending. Start the licence early, because it is often the slowest step."
    ],
    where: "Municipal council or panchayat office, and foscos.fssai.gov.in for food."
  },
  {
    id: "gold",
    group: "Money",
    q: "Should I pledge gold to raise money?",
    keys: ["gold", "sona", "mortgage", "pledge", "gold loan", "jewellery"],
    a: [
      "A gold loan is quick, but if you miss repayments the jewellery can be auctioned. Before pledging gold, check whether a <b>collateral-free</b> option fits: Mudra (up to ₹20 lakh), SVANidhi, an SHG loan or CMRY. Harshala's family once had to mortgage gold; scheme loans exist so that families don't have to.",
      "If you do take a gold loan, borrow from a bank or regulated NBFC, read the interest rate and auction terms, and keep the receipt safe. This is general information, not financial advice."
    ],
    where: "Compare at your bank branch before you decide."
  },
  {
    id: "digital",
    group: "Growing your business",
    q: "How do I start taking UPI and selling on WhatsApp?",
    keys: ["upi", "qr", "online payment", "whatsapp", "digital", "phonepe", "gpay", "paytm", "instagram", "social media"],
    a: [
      "<ul><li>Ask your bank for a <b>merchant UPI QR</b>. It is usually free, and payments go straight to your account.</li><li>Install <b>WhatsApp Business</b> and add a catalogue with a photo and price for each item.</li><li>Make a broadcast list of regular customers and share new stock once a week, not every day.</li><li>Create a free <b>Google Business Profile</b> so people can find you on Maps.</li></ul>",
      "Most customers at Shree Cold Drinks already pay by UPI, and those records help when you apply for a loan."
    ],
    where: "Your bank branch for the QR. Ask a family member or our community posts for help with the apps."
  },
  {
    id: "pricing",
    group: "Money",
    q: "How do I set prices and keep accounts?",
    keys: ["price", "pricing", "profit", "accounts", "hisaab", "hisab", "bookkeeping", "khata", "margin"],
    a: [
      "<ul><li>Price = cost of materials + your time + a share of rent and travel + profit.</li><li>Keep two notebooks, or one app: daily sales and daily expenses.</li><li>Pay yourself a fixed amount every week. Don't take money from the cash box whenever you need it.</li><li>Follow a rule like Bilkis: put a fixed share (she invests half) back into the business or savings.</li></ul>"
    ],
    where: "Free apps: Khatabook, OkCredit. SHG book-keepers also teach this."
  },
  {
    id: "helpers",
    group: "Growing your business",
    q: "I can't handle the festival rush alone. What can I do?",
    keys: ["helper", "staff", "rush", "festival", "alone", "busy", "hire", "train"],
    a: [
      "<ul><li>Take bookings by appointment on WhatsApp during festival weeks.</li><li>Train one or two trainees a few months before the season, as Harshala plans. Trainee fees can also be income.</li><li>Pair with another woman in the same trade to share busy days.</li><li>Free skilling courses under PMKVY and NRLM can train your helpers.</li></ul>"
    ],
    where: "Skill India Digital (skillindiadigital.gov.in) or your district skill centre."
  },
  {
    id: "insurance",
    group: "Money",
    q: "How do I protect my shop from floods or accidents?",
    keys: ["insurance", "flood", "fire", "loss", "bima", "protect", "risk"],
    a: [
      "The New Market traders lost ₹5 lakh of paint stock in the 1996 flood. Today you can buy a small <b>shop insurance</b> (fire and flood) policy from your bank. Two low-cost personal covers are also available through any bank account: <b>PM Jeevan Jyoti Bima</b> (life) and <b>PM Suraksha Bima</b> (accident).",
      "Keep stock off the floor in monsoon months, and photograph your stock every quarter for claims."
    ],
    where: "Your bank branch."
  }
];

AK.sources = [
  ["PIB: Mudra limit raised to ₹20 lakh (Oct 2024)", "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/oct/doc20241029426401.pdf"],
  ["PIB: Restructured PM SVANidhi (Dec 2025)", "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc20251220739401.pdf"],
  ["Vikaspedia: PMEGP", "https://en.vikaspedia.in/schemesall/schemes-for-entrepreneurs/prime-minister-employment-generation-programme-pmegp"],
  ["SBI: Stand-Up India", "https://sbi.co.in/web/get-business-product-information/stand-up-india"],
  ["Stand-Up India extended to 2031", "https://www.thehansindia.com/news/cities/new-delhi/centre-extends-stand-up-india-scheme-till-2031-1141137"],
  ["Govt. of Goa: EDC", "https://www.goa.gov.in/department/economic-development-corporation/"],
  ["Lakhpati Didi", "https://lakhpatididi.gov.in/"]
];
