from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "mysql+pymysql://root:Abdullah_170505@host.docker.internal/hrms_db"
DATABASE_URL = "mysql+pymysql://4YqJDtkonYkehfW.root:GsNlcBBSC4RVDLTG@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl_ca=<CA_PATH>&ssl_verify_cert=true&ssl_verify_identity=true"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
