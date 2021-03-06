/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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
  package: 'foam.dao',
  name: 'ArrayDAO',
  extends: 'foam.dao.AbstractDAO',

  documentation: 'DAO implementation backed by an array.',

  requires: [
    'foam.dao.ArraySink',
    'foam.mlang.predicate.True'
  ],

  properties: [
    {
      name: 'array',
      factory: function() { return []; }
    }
  ],

  methods: [
    function put(obj) {
      for ( var i = 0 ; i < this.array.length ; i++ ) {
        if ( obj.ID.compare(obj, this.array[i]) === 0 ) {
          this.array[i] = obj;
          break;
        }
      }

      if ( i == this.array.length ) this.array.push(obj);
      this.on.put.pub(obj);

      return Promise.resolve(obj);
    },

    function remove(obj) {
      for ( var i = 0 ; i < this.array.length ; i++ ) {
        if ( foam.util.equals(obj.id, this.array[i].id) ) {
          var o2 = this.array.splice(i, 1)[0];
          this.on.remove.pub(o2);
          break;
        }
      }

      return Promise.resolve();
    },

    function select(sink, skip, limit, order, predicate) {
      var resultSink = sink || this.ArraySink.create();

      sink = this.decorateSink_(resultSink, skip, limit, order, predicate);

      var fc = this.FlowControl.create();
      for ( var i = 0 ; i < this.array.length ; i++ ) {
        if ( fc.stopped ) break;
        if ( fc.errorEvt ) {
          sink.error(fc.errorEvt);
          return Promise.reject(fc.errorEvt);
        }

        sink.put(this.array[i], fc);
      }

      sink.eof();

      return Promise.resolve(resultSink);
    },

    function removeAll(skip, limit, order, predicate) {
      predicate = predicate || this.True.create();
      skip = skip || 0;
      limit = foam.Number.isInstance(limit) ? limit : Number.MAX_VALUE;

      for ( var i = 0; i < this.array.length && limit > 0; i++ ) {
        if ( predicate.f(this.array[i]) ) {
          if ( skip > 0 ) {
            skip--;
            continue;
          }
          var obj = this.array.splice(i, 1)[0];
          i--;
          limit--;
          this.on.remove.pub(obj);
        }
      }

      return Promise.resolve();
    },

    function find(id) {
      for ( var i = 0 ; i < this.array.length ; i++ ) {
        if ( foam.util.equals(id, this.array[i].id) ) {
          return Promise.resolve(this.array[i]);
        }
      }

      return Promise.resolve(null);
    }
  ]
});
