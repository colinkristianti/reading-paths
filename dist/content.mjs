// Demonstration content. Replace through the documented content contract after editorial review.
const word=(text,pinyin,zhuyin,level,gloss,row)=>({text,pinyin,zhuyin,level,gloss,source:{type:'tbcl-wordlist',row}});
const sentence=(text,target,textId,rank)=>({text,target,source:{type:'coct-verbatim',corpus:'COCT Written Corpus 2026',textId,queryId:'008ryt',rank,url:'https://bcoct.naer.edu.tw/cqpweb/yl_2014_2024/',status:'Context and teaching suitability awaiting editorial review'}});
export const CHARACTERS=[
 {id:'hao',char:'好',level:'1',title:'Good, or fond of?',hint:'A change in tone opens a different meaning.',readings:[
 {id:'hao-3',pinyin:'hǎo',zhuyin:'ㄏㄠˇ',meaning:'good; well',words:[word('好','hǎo','ㄏㄠˇ','1','good',42),word('好像','hǎoxiàng','ㄏㄠˇ ㄒㄧㄤˋ','2','to seem',452),word('最好','zuìhǎo','ㄗㄨㄟˋ ㄏㄠˇ','3','best',1022)],sentences:[]},
 {id:'hao-4',pinyin:'hào',zhuyin:'ㄏㄠˋ',meaning:'to be fond of; inclined toward',words:[word('愛好','àihào','ㄞˋ ㄏㄠˋ','4','an interest; to enjoy',1256),word('好奇','hàoqí','ㄏㄠˋ ㄑㄧˊ','4','curious',1927),word('好學','hàoxué','ㄏㄠˋ ㄒㄩㄝˊ','4*','eager to learn',2139)],sentences:[sentence('女人好奇的問。','好奇','2017_001243',5)]}]},
 {id:'kan',char:'看',level:'1',title:'One character, two readings.',hint:'A character stays in the collection even when a reading has no word in the selected vocabulary range.',readings:[
 {id:'kan-4',pinyin:'kàn',zhuyin:'ㄎㄢˋ',meaning:'to look; to see',words:[word('看','kàn','ㄎㄢˋ','1','to look',58),word('看見','kànjiàn','ㄎㄢˋ ㄐㄧㄢˋ','1*','to see',271)],sentences:[]},
 {id:'kan-1',pinyin:'kān',zhuyin:'ㄎㄢ',meaning:'to watch over; to guard',words:[],sentences:[],note:'No matching word has been confirmed in the selected TBCL 1–4* vocabulary. This reading remains part of the character lesson.'}],dictionary:'https://dict.concised.moe.edu.tw/dictView.jsp?ID=18436'},
 {id:'le',char:'樂',level:'1*',title:'Joy meets music.',hint:'Use the word to find the reading.',readings:[
 {id:'le-4',pinyin:'lè',zhuyin:'ㄌㄜˋ',meaning:'joy; happiness',words:[word('快樂','kuàilè','ㄎㄨㄞˋ ㄌㄜˋ','1*','happy',277),word('可樂','kělè','ㄎㄜˇ ㄌㄜˋ','2*','cola',687),word('樂觀','lèguān','ㄌㄜˋ ㄍㄨㄢ','4*','optimistic',2254)],sentences:[sentence('但是，她自己快樂嗎？','快樂','2019_000209',12)]},
 {id:'yue-4',pinyin:'yuè',zhuyin:'ㄩㄝˋ',meaning:'music',words:[word('音樂','yīnyuè','ㄧㄣ ㄩㄝˋ','2','music',576),word('音樂家','yīnyuèjiā','ㄧㄣ ㄩㄝˋ ㄐㄧㄚ','4*','musician',2595),word('樂團','yuètuán','ㄩㄝˋ ㄊㄨㄢˊ','4*','musical ensemble',2621)],sentences:[]}]},
 {id:'chang',char:'長',level:'1*',title:'Length, growth, and leaders.',hint:'The meaning around the character gives you a clue.',readings:[
 {id:'chang-2',pinyin:'cháng',zhuyin:'ㄔㄤˊ',meaning:'long; length',words:[word('長','cháng','ㄔㄤˊ','1*','long',199),word('長短','chángduǎn','ㄔㄤˊ ㄉㄨㄢˇ','4*','length',1988)],sentences:[]},
 {id:'zhang-3',pinyin:'zhǎng',zhuyin:'ㄓㄤˇ',meaning:'to grow; a leader',words:[word('長大','zhǎngdà','ㄓㄤˇ ㄉㄚˋ','3','to grow up',1011),word('家長','jiāzhǎng','ㄐㄧㄚ ㄓㄤˇ','4','parent',1792),word('校長','xiàozhǎng','ㄒㄧㄠˋ ㄓㄤˇ','4','school principal',1817)],sentences:[]}]},
 {id:'xing',char:'行',level:'2',title:'A journey, or a bank?',hint:'The same shape can belong to different word families.',readings:[
 {id:'xing-2',pinyin:'xíng',zhuyin:'ㄒㄧㄥˊ',meaning:'to go; to be possible',words:[word('旅行','lǚxíng','ㄌㄩˇ ㄒㄧㄥˊ','2','to travel',493),word('行李','xínglǐ','ㄒㄧㄥˊ ㄌㄧˇ','3','luggage',982),word('流行','liúxíng','ㄌㄧㄡˊ ㄒㄧㄥˊ','3','popular',904)],sentences:[]},
 {id:'hang-2',pinyin:'háng',zhuyin:'ㄏㄤˊ',meaning:'a line; a trade or business',words:[word('銀行','yínháng','ㄧㄣˊ ㄏㄤˊ','2','bank',575),word('行','háng','ㄏㄤˊ','2','a line; an industry',451)],sentences:[]}],note:'Additional dictionary readings will be added after the character audit. This is a sample lesson.'}
];
const prompts={hao:[['好像','hao-3'],['愛好','hao-4'],['好奇','hao-4'],['最好','hao-3'],['好學','hao-4']],le:[['快樂','le-4'],['音樂','yue-4'],['可樂','le-4'],['樂團','yue-4'],['樂觀','le-4']],chang:[['長短','chang-2'],['長大','zhang-3'],['家長','zhang-3'],['校長','zhang-3'],['長（long）','chang-2']],xing:[['銀行','hang-2'],['旅行','xing-2'],['行李','xing-2'],['流行','xing-2'],['行（an industry）','hang-2']]};
export const QUESTIONS=Object.entries(prompts).flatMap(([cid,rows])=>rows.map(([word,readingId],i)=>({id:`${cid}-${i+1}`,characterId:cid,readingId,word,kind:'word-reading',explanation:`Here, ${CHARACTERS.find(c=>c.id===cid).char} is read ${CHARACTERS.find(c=>c.id===cid).readings.find(r=>r.id===readingId).pinyin}.`,status:'demonstration'})));
export const DIAGNOSTIC=['hao-1','hao-2','le-1','le-2','xing-1','xing-2'].map(id=>QUESTIONS.find(q=>q.id===id));
