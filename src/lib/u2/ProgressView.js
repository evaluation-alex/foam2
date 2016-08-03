/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

foam.CLASS({
  package: 'foam.u2',
  name: 'ProgressView',
  extends: 'foam.u2.View',

  axioms: [
    foam.u2.CSS.create({
      code: function() {/*
        ^ {
          margin: 2px 0 0 10px;
          height: 23px;
          width: 183px;
        }
      */}
    })
  ],

  properties: [
    [ 'nodeName', 'progress' ]
  ],

  methods: [
    function initE() {
//      this.SUPER();
//      this.attrs({max: 100});
      this.
        cssClass(this.myCls()).
        attrs({max: 100});
      this.attrSlot().follow(this.data$);

//        attrs({value: this.data$, max: 100});
    }
  ]
});