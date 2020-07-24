'use strict';

const mock = require('egg-mock');

describe('test/zeus-utils.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/zeus-utils-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, zeusUtils')
      .expect(200);
  });
});
