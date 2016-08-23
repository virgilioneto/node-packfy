'use strict';
const Path = require('path');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Zip = require('../index').Zip;
const TestUtil = require('./TestUtil');

chai.should();

describe('Zip#packDir', () => {
    before(() => {
        TestUtil.removeFiles();
    });

    context('Valid operations', () => {
        it('Should accept only "path" parameter', (done) => {
            Zip.packDir(`${__dirname}/resource`)
                .on('error', (error) => {
                    assert.fail(error, undefined);
                    done();
                })
                .on('file', (file) => {
                    file.should.be.a('string');
                })
                .once('finish', (file) => {
                    file.should.be.a('string');
                    expect(Path.extname(file)).to.be.equal('.zip');
                    done();
                });
        });

        it('Should accept "destination"', (done) => {
            Zip.packDir(`${__dirname}/resource`, {destination: `${__dirname}/resource/tmp`})
                .on('error', (error) => {
                    assert.fail(error, undefined);
                    done();
                })
                .on('file', (file) => {
                    file.should.be.a('string');
                })
                .once('finish', (file) => {
                    file.should.be.a('string');
                    expect(Path.extname(file)).to.be.equal('.zip');
                    done();
                });
        });
        //
        it('Should be possible to set "targetName"', (done) => {
            Zip.packDir(`${__dirname}/resource`, {destination: `${__dirname}/resource/tmp`, targetName: `my-brand-new-zip`})
                .on('error', (error) => {
                    assert.fail(error, undefined);
                    done();
                })
                .on('file', (file) => {
                    file.should.be.a('string');
                })
                .once('finish', (file) => {
                    var suffix;
                    file.should.be.a('string');
                    expect(Path.extname(file)).to.be.equal('.zip');

                    suffix = file.split('.');
                    suffix = suffix[suffix.length - 2];

                    expect(Path.basename(file)).to.be.equal(`my-brand-new-zip.${suffix}.zip`);
                    done();
                });
        });
        //
        it('Should be possible to set "override"', (done) => {
            Zip.packDir(`${__dirname}/resource`, {destination: `${__dirname}/resource/tmp`, targetName: `my-brand-new-zip`, override: true})
                .on('error', (error) => {
                    assert.fail(error, undefined);
                    done();
                })
                .on('file', (file) => {
                    file.should.be.a('string');
                })
                .once('finish', (file) => {
                    file.should.be.a('string');
                    expect(Path.extname(file)).to.be.equal('.zip');
                    expect(Path.basename(file)).to.be.equal('my-brand-new-zip.zip');
                    done();
                });
        });
        //
        it('Should be possible to set "suffixMask"', (done) => {
            Zip.packDir(`${__dirname}/resource`, {destination: `${__dirname}/resource/tmp`, targetName: `my-brand-new-zip`, override: false, suffixMask: 'YYYY'})
                .on('error', (error) => {
                    assert.fail(error, undefined);
                    done();
                })
                .on('file', (file) => {
                    file.should.be.a('string');
                })
                .once('finish', (file) => {
                    var suffix;
                    file.should.be.a('string');
                    expect(Path.extname(file)).to.be.equal('.zip');

                    suffix = file.split('.');
                    suffix = suffix[suffix.length - 2];

                    expect(Path.basename(file)).to.be.equal(`my-brand-new-zip.${suffix}.zip`);
                    done();
                });
        });
    });

    context('Invalid operations', () => {
        it('Should return error when invalid "path" given', (done) => {
            Zip.packDir(`${__dirname}/invalid-path`)
                .on('error', (error) => {
                    expect(error).to.be.an('error');

                    expect(error).to.have.property('message');
                    expect(error).to.have.property('code');

                    error.message.should.be.a('string');
                    error.code.should.be.a('string');

                    expect(error.code).to.be.equal('ENOENT');
                    done();
                })
                .on('file', (file) => {
                    assert.fail(file, undefined);
                    done();
                })
                .once('finish', (file) => {
                    assert.fail(file, undefined);
                    done();
                });
        });
        //
        it('Should return error when invalid "destination" given', (done) => {
            Zip.packDir(`${__dirname}/invalid-path`, {destination: `${__dirname}/resource/folder`})
                .on('error', (error) => {
                    expect(error).to.be.an('error');

                    expect(error).to.have.property('message');
                    expect(error).to.have.property('code');

                    error.message.should.be.a('string');
                    error.code.should.be.a('string');

                    expect(error.code).to.be.equal('ENOENT');
                    done();
                })
                .on('file', (file) => {
                    assert.fail(file, undefined);
                    done();
                })
                .once('finish', (file) => {
                    assert.fail(file, undefined);
                    done();
                });
        });
    });

    after(() => {
        TestUtil.removeFiles();
    });
});