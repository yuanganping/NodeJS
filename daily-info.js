const rp = require("request-promise");

// Server酱SCKEY
const push_key = process.env.PUSH_KEY;

// 发送通知
async function sendNotification() {
  // 去除末尾的换行
  let SCKEY = push_key.replace(/[\r\n]/g, "");

  const text = "今日消息推送";
  const desp = "下面j具体的消息";

  const options = {
    uri: `https://sc.ftqq.com/${SCKEY}.send`,
    form: { text, desp },
    json: true,
    method: "POST",
  };
  let result = await rp.post(options);

  console.log("消息发送完毕： ", result.errno);
}

function main() {
  sendNotification();
}

main();
