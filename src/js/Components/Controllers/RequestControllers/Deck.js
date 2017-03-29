/**
 * 編成画面のやつ
 */
import Resource       from "../../Models/Resource";
import CaptureService from "../../Services/CaptureService";
import TrimService    from "../../Services/TrimService";
import Rectangle      from "../../Services/Rectangle";
import WindowService  from "../../Services/WindowService";
import OCR            from "../../Services/API/OCR";

export function onDeck() {
  // {{{ とりあえず頻繁すぎるのは無視する。4時間ごと
  const th = 4*60*60*1000;
  let last = Resource.last();
  if (last && Date.now() - last.created < th) return false;
  // }}}
  const ocr = new OCR();
  const captures = new CaptureService();
  WindowService.getInstance().find(true)
  // 画面が小さすぎると精度が落ちるのと、誤認識したときの対応がめんどいので除外する
  .then(tab => tab.width < 800 ? Promise.reject() : Promise.resolve(tab))
  // 画面比がぴったりでない場合は、めんどいので除外する
  .then(tab => tab.width/tab.height == 800/480 ? Promise.resolve(tab) : Promise.reject())
  .then(tab => captures.capture(tab.windowId))
  .then(uri => Image.init(uri))
  .then(img => {
    const trim = TrimService.init(img);
    const rect = Rectangle.init(img);
    return Promise.all([
      trim.trim(rect.ofResourceFuel(), true),
      trim.trim(rect.ofResourceAmmo(),true),
      trim.trim(rect.ofResourceSteel(), true),
      trim.trim(rect.ofResourceBauxite(), true),
      trim.trim(rect.ofResourceBuckets(), true),
    ]);
  })
  //  .then(urls => urls.map(url => window.open(url)));
  .then(urls => Promise.all(urls.map(url => ocr.execute(url))))
  .then(res =>  Promise.resolve(res.map(r => parseInt(r.result))))
  .then(([fuel, ammo, steel, bauxite, buckets]) => Promise.resolve(Resource.new({
    fuel, ammo, steel, bauxite, buckets, created: Date.now(),
  })))
  .then(resource => resource.save());
  return true;
}
