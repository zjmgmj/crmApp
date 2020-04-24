//
//  RNDatePicker.swift
//  crmobile
//
//  Created by 严骏 on 2018/10/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

import UIKit
@objc(RNDatePicker)
class RNDatePicker: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    return "RNDatePicker"
  }
  
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["sysVersion": UIDevice.current.systemVersion]
  }
  
  private var choosePickVal = ""
  private var window: UIWindow!
  private var cb: RCTResponseSenderBlock?
  private var isExist: Bool = false
  private var df = DateFormatter()
  @objc func isPickExist (_ callback: RCTResponseSenderBlock) {
    callback([self.isExist])
  }
  
  @objc func show(_ title: String, defaultVal: String, callback: @escaping RCTResponseSenderBlock) {
    DispatchQueue.main.async {
      self.df.dateFormat = "yyyy/MM/dd"
      self.choosePickVal = defaultVal
      self.isExist = true
      self.cb = callback
      self.window = UIApplication.shared.keyWindow!
      let bgView = UIView(frame: CGRect(x: 0, y: 0, width: self.window.bounds.width, height: self.window.bounds.height))
      bgView.backgroundColor = UIColor.black
      bgView.alpha = 0.6
      bgView.tag = 10000
      bgView.addGestureRecognizer(UITapGestureRecognizer.init(target: self, action: #selector(self.hide)))
      self.window.addSubview(bgView)
      let pickerView = UIView(frame: CGRect(x: 0, y: bgView.frame.height, width: bgView.frame.width, height: 250))
      pickerView.tag = 10001
      self.window.addSubview(pickerView)
      let pkview = UIDatePicker(frame: CGRect(x: 0, y: 34, width: bgView.frame.width, height: 216))
      pkview.datePickerMode = .date
      pkview.locale = Locale(identifier: "zh_CN")
      pkview.addTarget(self, action: #selector(self.pickerDateChange), for: UIControlEvents.valueChanged)
      pkview.backgroundColor = UIColor(red: CGFloat(249.0/255.0), green: CGFloat(249.0/255.0), blue: CGFloat(249.0/255.0), alpha: 0.8)
      pkview.date = self.df.date(from: self.choosePickVal)!
      pickerView.addSubview(pkview)
      let confirmView = UIView(frame: CGRect(x: 0, y: 0, width: bgView.frame.width, height: 40))
      confirmView.backgroundColor = UIColor.white
      pickerView.addSubview(confirmView)
      let textColor = UIColor(red: CGFloat(51.0/255.0), green: CGFloat(195.0/255.0), blue: CGFloat(246.0/255.0), alpha: 1.0)
      let confirmBtn = UIButton(frame: CGRect(x: bgView.frame.width - 15 - 40, y: 10, width: 40, height: 20))
      confirmBtn.titleLabel?.font = UIFont(name: "Heiti SC", size: 14)
      confirmBtn.setTitle("确定", for: .normal)
      confirmBtn.setTitleColor(textColor, for: .normal)
      confirmBtn.addTarget(self, action: #selector(self.pickerConfirm), for: .touchUpInside)
//      confirmBtn.layer.borderWidth = 1
      confirmView.addSubview(confirmBtn)
      let cancelBtn = UIButton(frame: CGRect(x: 15, y: confirmBtn.frame.origin.y, width: confirmBtn.frame.width, height: confirmBtn.frame.height))
      cancelBtn.setTitleColor(textColor, for: .normal)
      cancelBtn.setTitle("取消", for: .normal)
      cancelBtn.titleLabel?.font = UIFont(name: "Heiti SC", size: 14)
      cancelBtn.addTarget(self, action: #selector(self.hide), for: .touchUpInside)
      confirmView.addSubview(cancelBtn)
      let titleLbl = UILabel(frame: CGRect(x: (cancelBtn.frame.origin.x + confirmBtn.frame.width + 15), y: cancelBtn.frame.origin.y, width: (bgView.frame.width - 30 - 30 - cancelBtn.frame.width - confirmBtn.frame.width), height: cancelBtn.frame.height))
      titleLbl.textColor = UIColor.black
      titleLbl.text = title
      titleLbl.numberOfLines = 1
      titleLbl.textAlignment = .center
      confirmView.addSubview(titleLbl)
      UIView.animate(withDuration: 0.2, animations: {
        pickerView.frame.origin.y = bgView.frame.height - 250
      })
    }
  }
  
  @objc func pickerConfirm () {
    if (self.cb != nil) {
      self.cb!([self.choosePickVal])
    }
    self.hide()
  }
  
  @objc func pickerDateChange(datePicker: UIDatePicker) {
    print(datePicker.date)
    self.df.dateFormat = "yyyy/MM/dd"
    self.choosePickVal = self.df.string(from: datePicker.date)
  }
  
  @objc func hide () {
    DispatchQueue.main.async {
      UIView.animate(withDuration: 0.2, animations: {
        self.window.viewWithTag(10001)?.frame.origin.y = self.window.bounds.height + 10
      }, completion: { (bool) in
        if (bool) {
          self.window.viewWithTag(10001)?.removeFromSuperview()
          self.window.viewWithTag(10000)?.removeFromSuperview()
          self.isExist = false
          self.cb = nil
        }
      })
    }
  }
}
