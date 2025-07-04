USE [BookDB]
GO
/****** Object:  Database [BookDB]    Script Date: 04/06/2024 14:09:22 ******/
-- Create the database (let SQL Server handle file placement)
IF DB_ID('BookDB') IS NULL
BEGIN
    CREATE DATABASE [BookDB];
END
GO
-- Optional: set some properties
ALTER DATABASE [BookDB] SET COMPATIBILITY_LEVEL = 150;
GO

-- Enable full-text indexing if supported
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
BEGIN
    EXEC [BookDB].[dbo].[sp_fulltext_database] @action = 'enable';
END
GO
ALTER DATABASE [BookDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BookDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BookDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BookDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BookDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [BookDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BookDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BookDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BookDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BookDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BookDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BookDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BookDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BookDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BookDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [BookDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BookDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BookDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BookDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BookDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BookDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BookDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BookDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [BookDB] SET  MULTI_USER 
GO
ALTER DATABASE [BookDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BookDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BookDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BookDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [BookDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [BookDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [BookDB] SET QUERY_STORE = OFF
GO
USE [BookDB]
GO
/****** Object:  Table [dbo].[ACTIVITY_TYPES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACTIVITY_TYPES](
	[activity_type_id] [int] IDENTITY(1,1) NOT NULL,
	[activity_type_uuid] [uniqueidentifier] NOT NULL,
	[code] [varchar](50) NOT NULL,
	[label] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[activity_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AUDIT_TRAIL]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AUDIT_TRAIL](
	[audit_id] [int] IDENTITY(1,1) NOT NULL,
	[audit_uuid] [uniqueidentifier] NOT NULL,
	[entity_tablename] [varchar](100) NOT NULL,
	[entity_uuid] [uniqueidentifier] NOT NULL,
	[action_type] [varchar](20) NOT NULL,
	[action_date] [datetimeoffset](7) NOT NULL,
	[action_user_uuid] [uniqueidentifier] NOT NULL,
	[previous_data] [nvarchar](max) NULL,
	[new_data] [nvarchar](max) NULL,
	[source] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[audit_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AUTHOR]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AUTHOR](
	[author_id] [int] IDENTITY(1,1) NOT NULL,
	[author_uuid] [uniqueidentifier] NOT NULL,
	[author_full_name] [varchar](100) NOT NULL,
	[author_birth_date] [date] NULL,
	[author_birth_place] [varchar](100) NULL,
	[author_death_date] [date] NULL,
	[author_death_place] [varchar](100) NULL,
	[author_bio] [text] NULL,
	[is_deleted] [bit] NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[author_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AUTHOR_DISTINCTIONS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AUTHOR_DISTINCTIONS](
	[distinction_id] [int] IDENTITY(1,1) NOT NULL,
	[author_uuid] [uniqueidentifier] NOT NULL,
	[distinction_label] [varchar](255) NOT NULL,
	[distinction_date] [datetimeoffset](7) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
	[distinction_uuid] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[distinction_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AUTHOR_LANGUAGES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AUTHOR_LANGUAGES](
	[author_uuid] [uniqueidentifier] NOT NULL,
	[language_uuid] [uniqueidentifier] NOT NULL,
	[is_primary_language] [bit] NOT NULL,
	[added_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[author_uuid] ASC,
	[language_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BANNED_WORDS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BANNED_WORDS](
	[banned_word_id] [int] IDENTITY(1,1) NOT NULL,
	[word] [varchar](100) NOT NULL,
	[language_uuid] [uniqueidentifier] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
	[is_deleted] [bit] NOT NULL,
	[banned_word_uuid] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[banned_word_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK](
	[book_id] [int] IDENTITY(1,1) NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[book_title] [varchar](200) NOT NULL,
	[book_subtitle] [varchar](200) NULL,
	[book_description] [text] NULL,
	[book_pageCount] [int] NULL,
	[book_publishDate] [date] NULL,
	[book_isbn] [varchar](20) NULL,
	[book_price] [decimal](10, 2) NULL,
	[book_series_uuid] [uniqueidentifier] NULL,
	[is_deleted] [bit] NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[book_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_AUTHORS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_AUTHORS](
	[book_uuid] [uniqueidentifier] NOT NULL,
	[author_uuid] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[book_uuid] ASC,
	[author_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_CATEGORIES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_CATEGORIES](
	[book_uuid] [uniqueidentifier] NOT NULL,
	[category_uuid] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[book_uuid] ASC,
	[category_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_IMAGE_TYPE]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_IMAGE_TYPE](
	[image_type_id] [int] IDENTITY(1,1) NOT NULL,
	[image_type_uuid] [uniqueidentifier] NOT NULL,
	[label] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[image_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_IMAGES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_IMAGES](
	[imageID] [int] IDENTITY(1,1) NOT NULL,
	[image_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[image_url] [varchar](500) NOT NULL,
	[image_alt] [varchar](255) NULL,
	[is_cover] [bit] NULL,
	[image_order] [int] NULL,
	[image_type_uuid] [uniqueidentifier] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[imageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_LANGUAGES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_LANGUAGES](
	[book_uuid] [uniqueidentifier] NOT NULL,
	[language_uuid] [uniqueidentifier] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[book_uuid] ASC,
	[language_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_NOTES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_NOTES](
	[note_id] [int] IDENTITY(1,1) NOT NULL,
	[note_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[note_value] [decimal](3, 2) NULL,
	[note_comment] [text] NULL,
	[note_date] [datetimeoffset](7) NOT NULL,
	[is_moderated] [bit] NULL,
	[is_deleted] [bit] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[note_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_PUBLISHERS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_PUBLISHERS](
	[book_uuid] [uniqueidentifier] NOT NULL,
	[publisher_uuid] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[book_uuid] ASC,
	[publisher_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_SERIES_ORDER]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_SERIES_ORDER](
	[series_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[series_order] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[series_uuid] ASC,
	[book_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_TAGS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_TAGS](
	[book_uuid] [uniqueidentifier] NOT NULL,
	[tag_uuid] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[book_uuid] ASC,
	[tag_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_TRANSLATIONS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_TRANSLATIONS](
	[book_translation_id] [int] IDENTITY(1,1) NOT NULL,
	[book_translation_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[language_uuid] [uniqueidentifier] NULL,
	[title] [varchar](255) NULL,
	[summary] [text] NULL,
	[created_at] [datetimeoffset](7) NULL,
	[updated_at] [datetimeoffset](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[book_translation_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK_VERSION_HISTORY]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK_VERSION_HISTORY](
	[version_id] [int] IDENTITY(1,1) NOT NULL,
	[version_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NULL,
	[change_date] [datetimeoffset](7) NOT NULL,
	[version_description] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[version_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CATEGORIES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CATEGORIES](
	[category_id] [int] IDENTITY(1,1) NOT NULL,
	[category_uuid] [uniqueidentifier] NOT NULL,
	[category_name] [varchar](100) NOT NULL,
	[category_description] [text] NULL,
	[image_url] [varchar](500) NOT NULL,
	[image_alt] [varchar](255) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[COLORS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[COLORS](
	[color_id] [int] IDENTITY(1,1) NOT NULL,
	[color_uuid] [uniqueidentifier] NOT NULL,
	[color_name] [varchar](50) NOT NULL,
	[color_hex] [varchar](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[color_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GENDERS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GENDERS](
	[gender_id] [int] IDENTITY(1,1) NOT NULL,
	[gender_uuid] [uniqueidentifier] NOT NULL,
	[gender_label] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[gender_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LANGUAGES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LANGUAGES](
	[language_id] [int] IDENTITY(1,1) NOT NULL,
	[language_uuid] [uniqueidentifier] NOT NULL,
	[language_name] [varchar](100) NOT NULL,
	[iso_code] [varchar](10) NULL,
	[is_default] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[language_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MODERATION_LOGS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MODERATION_LOGS](
	[moderation_id] [int] IDENTITY(1,1) NOT NULL,
	[moderation_uuid] [uniqueidentifier] NOT NULL,
	[target_type] [varchar](50) NOT NULL,
	[target_uuid] [uniqueidentifier] NOT NULL,
	[trigger_reason] [varchar](255) NULL,
	[moderation_type] [varchar](50) NOT NULL,
	[moderation_level] [varchar](50) NOT NULL,
	[action] [varchar](255) NULL,
	[moderation_status] [varchar](20) NOT NULL,
	[moderation_comment] [text] NULL,
	[detected_by] [varchar](50) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NULL,
	[resolved] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[moderation_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NOTIFICATIONS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NOTIFICATIONS](
	[notification_id] [int] IDENTITY(1,1) NOT NULL,
	[notification_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[notification_title] [varchar](100) NULL,
	[notification_message] [text] NULL,
	[is_read] [bit] NULL,
	[notification_date] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[notification_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ORDER_HISTORY]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORDER_HISTORY](
	[order_id] [int] IDENTITY(1,1) NOT NULL,
	[order_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[order_date] [datetimeoffset](7) NOT NULL,
	[total_amount] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ORDER_ITEMS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORDER_ITEMS](
	[order_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[quantity] [int] NOT NULL,
	[unit_price] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[order_uuid] ASC,
	[book_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PREFERENCES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PREFERENCES](
	[preference_id] [int] IDENTITY(1,1) NOT NULL,
	[preference_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[language_uuid] [uniqueidentifier] NULL,
	[theme_uuid] [uniqueidentifier] NOT NULL,
	[color_uuid] [uniqueidentifier] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[preference_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PUBLISHER]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PUBLISHER](
	[publisher_id] [int] IDENTITY(1,1) NOT NULL,
	[publisher_uuid] [uniqueidentifier] NOT NULL,
	[publisher_name] [varchar](255) NOT NULL,
	[image_url] [varchar](500) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[publisher_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[READ_LIST_BOOKS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[READ_LIST_BOOKS](
	[readList_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[readList_uuid] ASC,
	[book_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[READ_LISTS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[READ_LISTS](
	[readList_id] [int] IDENTITY(1,1) NOT NULL,
	[readList_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[read_list_name] [varchar](100) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[readList_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SERIES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SERIES](
	[series_id] [int] IDENTITY(1,1) NOT NULL,
	[series_uuid] [uniqueidentifier] NOT NULL,
	[series_name] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[series_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SHOPPING_BASKET_ITEMS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SHOPPING_BASKET_ITEMS](
	[basket_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[quantity] [int] NOT NULL,
	[unit_price] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[basket_uuid] ASC,
	[book_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SHOPPING_BASKETS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SHOPPING_BASKETS](
	[basket_id] [int] IDENTITY(1,1) NOT NULL,
	[basket_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[basket_date_created] [datetimeoffset](7) NOT NULL,
	[is_finalized] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[basket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[STATE_STATUS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[STATE_STATUS](
	[state_status_id] [int] IDENTITY(1,1) NOT NULL,
	[state_status_uuid] [uniqueidentifier] NOT NULL,
	[code] [varchar](50) NOT NULL,
	[label] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[state_status_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TAGS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TAGS](
	[tag_id] [int] IDENTITY(1,1) NOT NULL,
	[tag_uuid] [uniqueidentifier] NOT NULL,
	[tag_label] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[tag_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[THEMES]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[THEMES](
	[theme_id] [int] IDENTITY(1,1) NOT NULL,
	[theme_uuid] [uniqueidentifier] NOT NULL,
	[theme_name] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[theme_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_BOOK_ACTIVITY]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_BOOK_ACTIVITY](
	[activity_id] [int] IDENTITY(1,1) NOT NULL,
	[activity_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[activity_type_uuid] [uniqueidentifier] NULL,
	[activity_date] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[activity_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_BOOK_STATE]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_BOOK_STATE](
	[user_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[state_status_uuid] [uniqueidentifier] NULL,
	[state_progress] [decimal](5, 2) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
 CONSTRAINT [PK_USER_BOOK_STATE] PRIMARY KEY CLUSTERED 
(
	[user_uuid] ASC,
	[book_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_CONNECTIONS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_CONNECTIONS](
	[connection_id] [int] IDENTITY(1,1) NOT NULL,
	[connection_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[connection_date] [datetimeoffset](7) NOT NULL,
	[connection_ip] [varchar](45) NULL,
	[connection_device] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[connection_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_RIGHTS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_RIGHTS](
	[user_right_id] [int] IDENTITY(1,1) NOT NULL,
	[user_right_uuid] [uniqueidentifier] NOT NULL,
	[user_right_name] [varchar](30) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_right_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_ROLE_HISTORY]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_ROLE_HISTORY](
	[history_id] [int] IDENTITY(1,1) NOT NULL,
	[history_uuid] [uniqueidentifier] NOT NULL,
	[target_user_uuid] [uniqueidentifier] NOT NULL,
	[modified_by_uuid] [uniqueidentifier] NOT NULL,
	[previous_right_uuid] [uniqueidentifier] NOT NULL,
	[new_right_uuid] [uniqueidentifier] NOT NULL,
	[change_date] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[history_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USERS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USERS](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[user_firstname] [varchar](50) NOT NULL,
	[user_lastname] [varchar](50) NOT NULL,
	[user_password] [varchar](100) NOT NULL,
	[user_password_last_changed_at] [datetimeoffset](7) NOT NULL,
	[user_must_change_password] [bit] NULL,
	[user_login] [varchar](30) NOT NULL,
	[user_email] [varchar](50) NOT NULL,
	[user_birthDate] [date] NULL,
	[is_deleted] [bit] NULL,
	[user_right_uuid] [uniqueidentifier] NOT NULL,
	[gender_uuid] [uniqueidentifier] NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WISHLIST_BOOKS]    Script Date: 22/05/2025 09:15:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WISHLIST_BOOKS](
	[wishlist_id] [int] IDENTITY(1,1) NOT NULL,
	[wishlist_uuid] [uniqueidentifier] NOT NULL,
	[user_uuid] [uniqueidentifier] NOT NULL,
	[book_uuid] [uniqueidentifier] NOT NULL,
	[wishlist_date_add] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[wishlist_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AUTHOR] ON 
GO
INSERT [dbo].[AUTHOR] ([author_id], [author_uuid], [author_full_name], [author_birth_date], [author_birth_place], [author_death_date], [author_death_place], [author_bio], [is_deleted], [created_at], [updated_at]) VALUES (1, N'80c1779f-a2d3-454c-89b8-22206cef08f8', N'John Ronald Reuel Tolkien', CAST(N'1892-01-03' AS Date), N'Bloemfontein (Afrique du Sud)', CAST(N'1973-09-02' AS Date), N'Bournemouth ', N'John Ronald Reuel Tolkien, plus connu sous sa signature : J. R. R. Tolkien, est un écrivain, poète, philologue et professeur d''université anglais. \n\n
Il est principalement connu en tant qu''auteur des romans de high fantasy "Bilbo le Hobbit" et "Le Seigneur des anneaux". \n\n
Tolkien est professeur d''anglo-saxon à l''université d''Oxford (Pembroke) de 1925 à 1949, et professeur de langue et de littérature anglaise à Merton de 1945 à 1959. Durant sa carrière universitaire, il défend l\’apprentissage des langues, surtout germaniques, et bouleverse l\’étude du poème anglo-saxon Beowulf avec sa conférence "Beowulf : Les Monstres et les Critiques" (1936). Son essai "Du conte de fées" (1939) est également considéré comme un texte crucial dans l\’étude de ce genre littéraire.\n\n
Ami proche de C. S. Lewis, qui fut plus tard l''auteur de la série du "Monde de Narnia", il est, comme lui, membre du groupe littéraire connu sous le nom d''Inklings. Tolkien est nommé commandeur de l''Ordre de l''Empire britannique par la reine Élisabeth II le 28 mars 1972. \n\n
Après sa mort, son troisième fils Christopher publie plusieurs ouvrages basés sur les nombreuses notes et manuscrits inédits de son père, dont "Le Silmarillion". \n\n
Avec "Bilbo le Hobbit" et "Le Seigneur des anneaux", ces livres forment un ensemble inspiré des légendes germaniques et celtiques, de récits, poèmes, essais et langues, concernant le monde imaginaire d''Arda, dont la Terre du Milieu est le continent principal. Dans les années 1950, Tolkien donne le nom de legendarium à ces écrits. \n\n
Ses ouvrages ont eu une influence majeure sur les écrivains de fantasy ultérieurs. En 2008, le Times l''a classé sixième d''une liste des « 50 plus grands écrivains britanniques depuis 1945 ». Ses romans "Le Hobbit" et "Le Seigneur des anneaux" ont connus des adaptations réalisées par Peter Jackson. Elles ont rencontré un grand succès, tant populaire que critique avec 17 Oscars (sur 36 nominations). \n
Amazon a acheté les droits du "Seigneur des anneaux" en 2017 pour l''adapter en série télévisée.', 0, CAST(N'2025-05-15T14:46:54.2527001+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:46:54.2527001+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[AUTHOR] ([author_id], [author_uuid], [author_full_name], [author_birth_date], [author_birth_place], [author_death_date], [author_death_place], [author_bio], [is_deleted], [created_at], [updated_at]) VALUES (2, N'c0fd7b34-6bb2-485f-88da-2d93a5319e68', N'A.G', NULL, NULL, NULL, NULL, NULL, 0, CAST(N'2025-05-15T14:50:31.5947992+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:50:31.5947992+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[AUTHOR] ([author_id], [author_uuid], [author_full_name], [author_birth_date], [author_birth_place], [author_death_date], [author_death_place], [author_bio], [is_deleted], [created_at], [updated_at]) VALUES (3, N'940edf57-6655-4182-a6e7-45d97562597f', N'Test', NULL, NULL, NULL, NULL, NULL, 0, CAST(N'2025-05-15T14:50:49.4602480+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:50:49.4602480+02:00' AS DateTimeOffset))
GO
SET IDENTITY_INSERT [dbo].[AUTHOR] OFF
GO
SET IDENTITY_INSERT [dbo].[BOOK] ON 
GO
INSERT [dbo].[BOOK] ([book_id], [book_uuid], [book_title], [book_subtitle], [book_description], [book_pageCount], [book_publishDate], [book_isbn], [book_price], [book_series_uuid], [is_deleted], [created_at], [updated_at]) VALUES (11, N'1ba3274c-1762-4dee-a1c9-c02937442db0', N'Le Silmarillion', NULL, N'Les Premiers Jours du Monde étaient à peine passés quand Fëanor, le plus doué des Elfes, créa les trois Silmarils. Ces bijoux renfermaient la Lumière des Deux Arbres de Valinor. Morgoth, le premier Prince de la Nuit, était encore sur la Terre du Milieu, et il fut fâché d''apprendre que la Lumière allait se perpétuer. Alors il enleva les Silmarils, les fit sertir dans son diadème et garder dans la forteresse d''Angband. Les Elfes prirent les armes pour reprendre les joyaux et ce fut la première de toutes les guerres. Longtemps, longtemps après, lors de la Guerre de l''Anneau, Elrond et Galadriel en parlaient encore.', 480, CAST(N'2003-11-20' AS Date), NULL, CAST(15.00 AS Decimal(10, 2)), NULL, 0, CAST(N'2025-05-15T12:20:44.2376850+02:00' AS DateTimeOffset), CAST(N'2025-05-15T12:20:44.2376850+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[BOOK] ([book_id], [book_uuid], [book_title], [book_subtitle], [book_description], [book_pageCount], [book_publishDate], [book_isbn], [book_price], [book_series_uuid], [is_deleted], [created_at], [updated_at]) VALUES (12, N'2fd8e031-6206-4835-bbf2-5d07995f266a', N'ss', NULL, N'efeaf', 45, CAST(N'2024-05-02' AS Date), NULL, CAST(8.00 AS Decimal(10, 2)), NULL, 0, CAST(N'2025-05-15T12:26:16.8764628+02:00' AS DateTimeOffset), CAST(N'2025-05-15T12:26:16.8764628+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[BOOK] ([book_id], [book_uuid], [book_title], [book_subtitle], [book_description], [book_pageCount], [book_publishDate], [book_isbn], [book_price], [book_series_uuid], [is_deleted], [created_at], [updated_at]) VALUES (14, N'651e93bf-7b43-46df-a76d-3136616e0a33', N'test', NULL, N'aefaefeaf', 20, CAST(N'2024-05-03' AS Date), NULL, CAST(0.00 AS Decimal(10, 2)), NULL, 0, CAST(N'2025-05-15T12:28:11.8758769+02:00' AS DateTimeOffset), CAST(N'2025-05-15T12:28:11.8758769+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[BOOK] ([book_id], [book_uuid], [book_title], [book_subtitle], [book_description], [book_pageCount], [book_publishDate], [book_isbn], [book_price], [book_series_uuid], [is_deleted], [created_at], [updated_at]) VALUES (17, N'aeb7edbc-68f3-4b31-9de3-2b27fa836ff6', N'lotr', NULL, N'lotr', 20, CAST(N'2024-05-07' AS Date), NULL, CAST(25.00 AS Decimal(10, 2)), NULL, 0, CAST(N'2025-05-15T12:28:44.7415242+02:00' AS DateTimeOffset), CAST(N'2025-05-15T12:28:44.7415242+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[BOOK] ([book_id], [book_uuid], [book_title], [book_subtitle], [book_description], [book_pageCount], [book_publishDate], [book_isbn], [book_price], [book_series_uuid], [is_deleted], [created_at], [updated_at]) VALUES (18, N'34723a86-bbaf-43ae-91a3-91a59d295b6a', N'Tout ce que j''ai à te dire.', NULL, N'Tout ce que j’ai à te dire.” est un recueil captivant de plus de 150 textes originaux qui explorent les facettes les plus profondes de la vie humaine.  C’est un voyage intime à travers les méandres de l’âme humaine, où l’auteur ouvre son cœur pour partager ses pensées les plus profondes et ses émotions les plus sincères.  À travers des réflexions sur les relations amoureuses et amicales, la santé mentale et le deuil, l’auteur ouvre son cœur pour partager un voyage émotionnel poignant avec les lecteurs.  Chaque texte est une fenêtre ouverte sur les sentiments les plus intimes et les émotions les plus authentiques, offrant une expérience de lecture immersive et révélatrice.  À travers chaque page, l’introspection devient un chemin vers la découverte de soi-même, tandis que l’amour, sous toutes ses formes, est exploré avec une sensibilité poignante.  Les lecteurs sont invités à plonger dans les tréfonds de la santé mentale, où les luttes et les triomphes sont exposés avec une franchise désarmante.  Ce recueil offre un refuge pour ceux qui cherchent à comprendre et à exprimer leurs propres expériences, tout en rappelant la beauté et la complexité de l’humanité.  Que vous soyez en quête de réconfort, de compréhension ou simplement d’une connexion humaine, ce recueil saura vous toucher en plein cœur.', 171, CAST(N'2024-03-12' AS Date), NULL, CAST(10.00 AS Decimal(10, 2)), NULL, 0, CAST(N'2025-05-15T12:30:20.4878573+02:00' AS DateTimeOffset), CAST(N'2025-05-15T12:30:20.4878573+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[BOOK] ([book_id], [book_uuid], [book_title], [book_subtitle], [book_description], [book_pageCount], [book_publishDate], [book_isbn], [book_price], [book_series_uuid], [is_deleted], [created_at], [updated_at]) VALUES (20, N'0f2e3eb6-4fef-4a9a-a026-b2e38b8cb575', N'ss', NULL, N'Voluptatem ea vero r', 100, CAST(N'2024-05-29' AS Date), NULL, CAST(0.50 AS Decimal(10, 2)), NULL, 0, CAST(N'2025-05-15T12:31:21.3673633+02:00' AS DateTimeOffset), CAST(N'2025-05-15T12:31:21.3673633+02:00' AS DateTimeOffset))
GO
SET IDENTITY_INSERT [dbo].[BOOK] OFF
GO
INSERT [dbo].[BOOK_AUTHORS] ([book_uuid], [author_uuid]) VALUES (N'aeb7edbc-68f3-4b31-9de3-2b27fa836ff6', N'80c1779f-a2d3-454c-89b8-22206cef08f8')
GO
INSERT [dbo].[BOOK_AUTHORS] ([book_uuid], [author_uuid]) VALUES (N'651e93bf-7b43-46df-a76d-3136616e0a33', N'80c1779f-a2d3-454c-89b8-22206cef08f8')
GO
INSERT [dbo].[BOOK_AUTHORS] ([book_uuid], [author_uuid]) VALUES (N'2fd8e031-6206-4835-bbf2-5d07995f266a', N'c0fd7b34-6bb2-485f-88da-2d93a5319e68')
GO
INSERT [dbo].[BOOK_AUTHORS] ([book_uuid], [author_uuid]) VALUES (N'34723a86-bbaf-43ae-91a3-91a59d295b6a', N'c0fd7b34-6bb2-485f-88da-2d93a5319e68')
GO
INSERT [dbo].[BOOK_AUTHORS] ([book_uuid], [author_uuid]) VALUES (N'0f2e3eb6-4fef-4a9a-a026-b2e38b8cb575', N'940edf57-6655-4182-a6e7-45d97562597f')
GO
INSERT [dbo].[BOOK_AUTHORS] ([book_uuid], [author_uuid]) VALUES (N'1ba3274c-1762-4dee-a1c9-c02937442db0', N'80c1779f-a2d3-454c-89b8-22206cef08f8')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'aeb7edbc-68f3-4b31-9de3-2b27fa836ff6', N'ccf4c85a-fe49-4580-919a-3ff1b100d09c')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'651e93bf-7b43-46df-a76d-3136616e0a33', N'1550c16b-42b6-46ed-ad8d-6ea1a008bc6f')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'2fd8e031-6206-4835-bbf2-5d07995f266a', N'9fc45653-dafd-4ef7-bed2-1a0305ceba3e')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'2fd8e031-6206-4835-bbf2-5d07995f266a', N'1550c16b-42b6-46ed-ad8d-6ea1a008bc6f')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'34723a86-bbaf-43ae-91a3-91a59d295b6a', N'ccf4c85a-fe49-4580-919a-3ff1b100d09c')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'0f2e3eb6-4fef-4a9a-a026-b2e38b8cb575', N'9fc45653-dafd-4ef7-bed2-1a0305ceba3e')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'1ba3274c-1762-4dee-a1c9-c02937442db0', N'9fc45653-dafd-4ef7-bed2-1a0305ceba3e')
GO
INSERT [dbo].[BOOK_CATEGORIES] ([book_uuid], [category_uuid]) VALUES (N'1ba3274c-1762-4dee-a1c9-c02937442db0', N'ccf4c85a-fe49-4580-919a-3ff1b100d09c')
GO
INSERT [dbo].[BOOK_PUBLISHERS] ([book_uuid], [publisher_uuid]) VALUES (N'aeb7edbc-68f3-4b31-9de3-2b27fa836ff6', N'9ff2f770-7ec5-4af0-acb9-5848d7629b77')
GO
INSERT [dbo].[BOOK_PUBLISHERS] ([book_uuid], [publisher_uuid]) VALUES (N'651e93bf-7b43-46df-a76d-3136616e0a33', N'864df54b-5ddc-41f6-95e1-30dcdbe8e32c')
GO
INSERT [dbo].[BOOK_PUBLISHERS] ([book_uuid], [publisher_uuid]) VALUES (N'2fd8e031-6206-4835-bbf2-5d07995f266a', N'864df54b-5ddc-41f6-95e1-30dcdbe8e32c')
GO
INSERT [dbo].[BOOK_PUBLISHERS] ([book_uuid], [publisher_uuid]) VALUES (N'34723a86-bbaf-43ae-91a3-91a59d295b6a', N'dd4c0831-145d-470b-8d20-0385fe1d62f7')
GO
INSERT [dbo].[BOOK_PUBLISHERS] ([book_uuid], [publisher_uuid]) VALUES (N'0f2e3eb6-4fef-4a9a-a026-b2e38b8cb575', N'864df54b-5ddc-41f6-95e1-30dcdbe8e32c')
GO
INSERT [dbo].[BOOK_PUBLISHERS] ([book_uuid], [publisher_uuid]) VALUES (N'1ba3274c-1762-4dee-a1c9-c02937442db0', N'ff3ec982-d722-401a-93aa-3fb8c751ffbb')
GO
SET IDENTITY_INSERT [dbo].[CATEGORIES] ON 
GO
INSERT [dbo].[CATEGORIES] ([category_id], [category_uuid], [category_name], [category_description], [image_url], [image_alt], [created_at], [updated_at]) VALUES (3, N'ccf4c85a-fe49-4580-919a-3ff1b100d09c', N'Fantasy', N'La fantasy est un genre qui utilise la magie et d''autres formes surnaturelles comme élément principal de l''intrigue, du thème et/ou du cadre.', N'https://img.freepik.com/free-vector/world-book-day-illustration_24908-59389.jpg?ga=GA1.1.172588783.1747145085&w=740', N'Image Fantasy', CAST(N'2025-05-15T11:37:30.5417427+02:00' AS DateTimeOffset), CAST(N'2025-05-15T11:37:30.5417427+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[CATEGORIES] ([category_id], [category_uuid], [category_name], [category_description], [image_url], [image_alt], [created_at], [updated_at]) VALUES (4, N'9fc45653-dafd-4ef7-bed2-1a0305ceba3e', N'Fiction', N'La fiction consiste à raconter des histoires qui ne sont pas réelles. Plus précisément, la fiction est une forme imaginative de narration, l''un des quatre modes rhétoriques fondamentaux.', N'https://img.freepik.com/free-vector/world-book-day-illustration_24908-59389.jpg?ga=GA1.1.172588783.1747145085&w=740', N'Image Fiction', CAST(N'2025-05-15T11:38:09.3440635+02:00' AS DateTimeOffset), CAST(N'2025-05-15T11:38:09.3440635+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[CATEGORIES] ([category_id], [category_uuid], [category_name], [category_description], [image_url], [image_alt], [created_at], [updated_at]) VALUES (5, N'1550c16b-42b6-46ed-ad8d-6ea1a008bc6f', N'Animaux', N'Les animaux sont des organismes eucaryotes multicellulaires appartenant au règne Animalia (également connu sous le nom de Metazoa). Tous les animaux sont mobiles, c''est-à-dire qu''ils peuvent se déplacer spontanément et indépendamment à un moment donné de leur vie. La forme de leur corps se fixe au fur et à mesure de leur développement, bien que certains subissent un processus de métamorphose plus tard dans leur vie. Tous les animaux sont hétérotrophes : ils doivent ingérer d''autres organismes ou leurs produits pour se nourrir.', N'https://img.freepik.com/free-vector/world-book-day-illustration_24908-59389.jpg?ga=GA1.1.172588783.1747145085&w=740', N'Image Fiction', CAST(N'2025-05-15T11:44:59.4911252+02:00' AS DateTimeOffset), CAST(N'2025-05-15T11:44:59.4911252+02:00' AS DateTimeOffset))
GO
SET IDENTITY_INSERT [dbo].[CATEGORIES] OFF
GO
SET IDENTITY_INSERT [dbo].[GENDERS] ON 
GO
INSERT [dbo].[GENDERS] ([gender_id], [gender_uuid], [gender_label]) VALUES (1, N'3a7e233e-6046-4998-b115-74c265f6e6e9', N'Homme')
GO
INSERT [dbo].[GENDERS] ([gender_id], [gender_uuid], [gender_label]) VALUES (2, N'b31cf293-2ff3-49a3-b6ae-c0271d6eebcb', N'Femme')
GO
SET IDENTITY_INSERT [dbo].[GENDERS] OFF
GO
SET IDENTITY_INSERT [dbo].[PUBLISHER] ON 
GO
INSERT [dbo].[PUBLISHER] ([publisher_id], [publisher_uuid], [publisher_name], [image_url], [created_at], [updated_at]) VALUES (1, N'9ff2f770-7ec5-4af0-acb9-5848d7629b77', N'Christian Bourgois', N'https://www.creativebookpublishing.ca/wp-content/uploads/2018/04/Major-Newfoundland-book-publishing-houses.jpg', CAST(N'2025-05-15T14:57:54.2031419+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:57:54.2031419+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[PUBLISHER] ([publisher_id], [publisher_uuid], [publisher_name], [image_url], [created_at], [updated_at]) VALUES (2, N'57c2bc5f-88f3-4f34-93d4-f3a75d18e55d', N'HarperCollins', N'https://www.creativebookpublishing.ca/wp-content/uploads/2018/04/Major-Newfoundland-book-publishing-houses.jpg', CAST(N'2025-05-15T14:58:15.5602106+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:58:15.5602106+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[PUBLISHER] ([publisher_id], [publisher_uuid], [publisher_name], [image_url], [created_at], [updated_at]) VALUES (3, N'ff3ec982-d722-401a-93aa-3fb8c751ffbb', N'Pocket', N'https://www.creativebookpublishing.ca/wp-content/uploads/2018/04/Major-Newfoundland-book-publishing-houses.jpg', CAST(N'2025-05-15T14:58:25.9978172+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:58:25.9978172+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[PUBLISHER] ([publisher_id], [publisher_uuid], [publisher_name], [image_url], [created_at], [updated_at]) VALUES (4, N'864df54b-5ddc-41f6-95e1-30dcdbe8e32c', N'test', N'https://www.creativebookpublishing.ca/wp-content/uploads/2018/04/Major-Newfoundland-book-publishing-houses.jpg', CAST(N'2025-05-15T14:58:36.8049612+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:58:36.8049612+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[PUBLISHER] ([publisher_id], [publisher_uuid], [publisher_name], [image_url], [created_at], [updated_at]) VALUES (5, N'dd4c0831-145d-470b-8d20-0385fe1d62f7', N'Indépendant', N'https://www.creativebookpublishing.ca/wp-content/uploads/2018/04/Major-Newfoundland-book-publishing-houses.jpg', CAST(N'2025-05-15T14:58:47.3572200+02:00' AS DateTimeOffset), CAST(N'2025-05-15T14:58:47.3572200+02:00' AS DateTimeOffset))
GO
SET IDENTITY_INSERT [dbo].[PUBLISHER] OFF
GO
SET IDENTITY_INSERT [dbo].[USER_RIGHTS] ON 
GO
INSERT [dbo].[USER_RIGHTS] ([user_right_id], [user_right_uuid], [user_right_name]) VALUES (1, N'327efc4f-d6ee-4e87-8a40-5d5811c6a4b3', N'User')
GO
INSERT [dbo].[USER_RIGHTS] ([user_right_id], [user_right_uuid], [user_right_name]) VALUES (2, N'868b663f-9934-418e-b88b-884dc5dd2170', N'Admin')
GO
INSERT [dbo].[USER_RIGHTS] ([user_right_id], [user_right_uuid], [user_right_name]) VALUES (3, N'53de81c6-649a-41c4-8ee9-5f0f7ff4d240', N'Super Admin')
GO
SET IDENTITY_INSERT [dbo].[USER_RIGHTS] OFF
GO
SET IDENTITY_INSERT [dbo].[USERS] ON 
GO
INSERT [dbo].[USERS] ([user_id], [user_uuid], [user_firstname], [user_lastname], [user_password], [user_password_last_changed_at], [user_must_change_password], [user_login], [user_email], [user_birthDate], [is_deleted], [user_right_uuid], [gender_uuid], [created_at], [updated_at]) VALUES (2, N'f1b48774-2c8b-45ee-ba0d-bd6420455e9e', N'First', N'Last', N'$2a$11$4LnICLVyB.lDPan741uPg.9H46vLpWJVAyEsSIPPtJ/89BLvg8enq', CAST(N'2025-05-15T11:20:51.1237225+02:00' AS DateTimeOffset), 0, N'log', N'email@gmail.com', CAST(N'2000-05-15' AS Date), 0, N'53de81c6-649a-41c4-8ee9-5f0f7ff4d240', N'3a7e233e-6046-4998-b115-74c265f6e6e9', CAST(N'2025-05-15T11:20:51.1237225+02:00' AS DateTimeOffset), CAST(N'2025-05-15T11:20:51.1237225+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[USERS] ([user_id], [user_uuid], [user_firstname], [user_lastname], [user_password], [user_password_last_changed_at], [user_must_change_password], [user_login], [user_email], [user_birthDate], [is_deleted], [user_right_uuid], [gender_uuid], [created_at], [updated_at]) VALUES (9, N'c8c52f6d-6c88-4da1-ab9d-00354f695d98', N'string', N'string', N'$2a$11$8HbPP1YpMEsQL92aMSW24eXaAHBGZz2yJDEHhfGNMGs42fNt5C13e', CAST(N'2025-05-15T11:27:49.2937843+02:00' AS DateTimeOffset), 0, N'string', N'string@gmail.com', CAST(N'2000-05-15' AS Date), 0, N'868b663f-9934-418e-b88b-884dc5dd2170', N'3a7e233e-6046-4998-b115-74c265f6e6e9', CAST(N'2025-05-15T11:27:49.2937843+02:00' AS DateTimeOffset), CAST(N'2025-05-15T11:27:49.2937843+02:00' AS DateTimeOffset))
GO
INSERT [dbo].[USERS] ([user_id], [user_uuid], [user_firstname], [user_lastname], [user_password], [user_password_last_changed_at], [user_must_change_password], [user_login], [user_email], [user_birthDate], [is_deleted], [user_right_uuid], [gender_uuid], [created_at], [updated_at]) VALUES (12, N'2d295f77-ffb7-4667-93de-6fe4cd9df56a', N'test', N'test', N'$2a$11$cIm6CGQmN0W8IUJ9zooGVeFDSxOpQf9hXNwqx4xoPuSiVg//6zx1O', CAST(N'2025-05-15T11:30:05.7246526+02:00' AS DateTimeOffset), 0, N'test', N'test@test.fr', CAST(N'2020-02-12' AS Date), 0, N'327efc4f-d6ee-4e87-8a40-5d5811c6a4b3', N'b31cf293-2ff3-49a3-b6ae-c0271d6eebcb', CAST(N'2025-05-15T11:30:05.7246526+02:00' AS DateTimeOffset), CAST(N'2025-05-15T11:30:05.7246526+02:00' AS DateTimeOffset))
GO
SET IDENTITY_INSERT [dbo].[USERS] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__ACTIVITY__357D4CF9EF63BEBB]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[ACTIVITY_TYPES] ADD UNIQUE NONCLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__ACTIVITY__7EF01810A22BAA7A]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[ACTIVITY_TYPES] ADD UNIQUE NONCLUSTERED 
(
	[activity_type_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__AUDIT_TR__A65B6CD09E30948E]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[AUDIT_TRAIL] ADD UNIQUE NONCLUSTERED 
(
	[audit_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__AUTHOR__A1F124D0EC741F33]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[AUTHOR] ADD UNIQUE NONCLUSTERED 
(
	[author_full_name] ASC,
	[author_birth_date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__AUTHOR__B5CD0316F16E7C1F]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[AUTHOR] ADD UNIQUE NONCLUSTERED 
(
	[author_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__BANNED_W__839740540FFAEFDD]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BANNED_WORDS] ADD UNIQUE NONCLUSTERED 
(
	[word] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BOOK__AA8FB793DB69C7CB]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BOOK] ADD UNIQUE NONCLUSTERED 
(
	[book_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BOOK_IMA__3E43434813693BE3]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BOOK_IMAGE_TYPE] ADD UNIQUE NONCLUSTERED 
(
	[image_type_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BOOK_IMA__85A26DE847486D89]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BOOK_IMAGES] ADD UNIQUE NONCLUSTERED 
(
	[image_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BOOK_NOT__E3F87F4D102891BE]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BOOK_NOTES] ADD UNIQUE NONCLUSTERED 
(
	[note_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BOOK_TRA__A3AFF065AADA48D6]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BOOK_TRANSLATIONS] ADD UNIQUE NONCLUSTERED 
(
	[book_translation_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BOOK_TRA__BEF8F297AA807F10]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BOOK_TRANSLATIONS] ADD UNIQUE NONCLUSTERED 
(
	[book_uuid] ASC,
	[language_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BOOK_VER__7240DF08882DC32E]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[BOOK_VERSION_HISTORY] ADD UNIQUE NONCLUSTERED 
(
	[version_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__CATEGORI__4257ADA439886032]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[CATEGORIES] ADD UNIQUE NONCLUSTERED 
(
	[category_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__CATEGORI__5189E255F7D33FF3]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[CATEGORIES] ADD UNIQUE NONCLUSTERED 
(
	[category_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__COLORS__543625985ED772E5]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[COLORS] ADD UNIQUE NONCLUSTERED 
(
	[color_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__GENDERS__8D9124A0A24F5DCA]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[GENDERS] ADD UNIQUE NONCLUSTERED 
(
	[gender_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__LANGUAGE__153DD4A6953EA234]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[LANGUAGES] ADD UNIQUE NONCLUSTERED 
(
	[iso_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__LANGUAGE__477450419696987E]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[LANGUAGES] ADD UNIQUE NONCLUSTERED 
(
	[language_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__MODERATI__99EB959F7A9C9ACA]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[MODERATION_LOGS] ADD UNIQUE NONCLUSTERED 
(
	[moderation_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__NOTIFICA__AF8FFDCC5495BDAE]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[NOTIFICATIONS] ADD UNIQUE NONCLUSTERED 
(
	[notification_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__ORDER_HI__3DE398660EACEC5B]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[ORDER_HISTORY] ADD UNIQUE NONCLUSTERED 
(
	[order_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__PREFEREN__026ADC377CF20FFA]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[PREFERENCES] ADD UNIQUE NONCLUSTERED 
(
	[preference_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__PREFEREN__37BE7BB6260327AD]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[PREFERENCES] ADD UNIQUE NONCLUSTERED 
(
	[user_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__PUBLISHE__F6E28EB939B4F790]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[PUBLISHER] ADD UNIQUE NONCLUSTERED 
(
	[publisher_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__READ_LIS__67AE94D0BD796F09]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[READ_LISTS] ADD UNIQUE NONCLUSTERED 
(
	[readList_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__SERIES__93F3FD60530CD707]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[SERIES] ADD UNIQUE NONCLUSTERED 
(
	[series_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__SHOPPING__392DA560D261BA69]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[SHOPPING_BASKETS] ADD UNIQUE NONCLUSTERED 
(
	[basket_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__STATE_ST__357D4CF97AED6E29]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[STATE_STATUS] ADD UNIQUE NONCLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__STATE_ST__D70F46C3114A85F7]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[STATE_STATUS] ADD UNIQUE NONCLUSTERED 
(
	[state_status_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__TAGS__51EE2D564F39F24E]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[TAGS] ADD UNIQUE NONCLUSTERED 
(
	[tag_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__THEMES__0444B772B0A708E5]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[THEMES] ADD UNIQUE NONCLUSTERED 
(
	[theme_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__THEMES__3D6866353B03D7D9]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[THEMES] ADD UNIQUE NONCLUSTERED 
(
	[theme_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__USER_BOO__8BE4EB3DB059654E]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USER_BOOK_ACTIVITY] ADD UNIQUE NONCLUSTERED 
(
	[activity_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__USER_CON__CEDB16623FF5D71E]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USER_CONNECTIONS] ADD UNIQUE NONCLUSTERED 
(
	[connection_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__USER_RIG__45565B2CE70DC2EF]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USER_RIGHTS] ADD UNIQUE NONCLUSTERED 
(
	[user_right_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USER_RIG__54B7341DDEB6DBB7]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USER_RIGHTS] ADD UNIQUE NONCLUSTERED 
(
	[user_right_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__USER_ROL__EF0FC8D61098FA34]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USER_ROLE_HISTORY] ADD UNIQUE NONCLUSTERED 
(
	[history_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__USERS__37BE7BB64212B006]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USERS] ADD UNIQUE NONCLUSTERED 
(
	[user_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USERS__9EA1B5AF7A9CE0EF]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USERS] ADD UNIQUE NONCLUSTERED 
(
	[user_login] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USERS__B0FBA212A534DC8E]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[USERS] ADD UNIQUE NONCLUSTERED 
(
	[user_email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__WISHLIST__0D1680CFCAB0AB39]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[WISHLIST_BOOKS] ADD UNIQUE NONCLUSTERED 
(
	[user_uuid] ASC,
	[book_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__WISHLIST__6EAF50C372F32DCC]    Script Date: 22/05/2025 09:15:42 ******/
ALTER TABLE [dbo].[WISHLIST_BOOKS] ADD UNIQUE NONCLUSTERED 
(
	[wishlist_uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[USER_BOOK_STATE] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[USER_BOOK_STATE] ADD  DEFAULT (sysdatetimeoffset()) FOR [updated_at]
GO
ALTER TABLE [dbo].[AUDIT_TRAIL]  WITH CHECK ADD  CONSTRAINT [FK_AUDIT_TRAIL_USER] FOREIGN KEY([action_user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[AUDIT_TRAIL] CHECK CONSTRAINT [FK_AUDIT_TRAIL_USER]
GO
ALTER TABLE [dbo].[AUTHOR_DISTINCTIONS]  WITH CHECK ADD  CONSTRAINT [FK_AUTHOR_DISTINCTIONS_AUTHOR] FOREIGN KEY([author_uuid])
REFERENCES [dbo].[AUTHOR] ([author_uuid])
GO
ALTER TABLE [dbo].[AUTHOR_DISTINCTIONS] CHECK CONSTRAINT [FK_AUTHOR_DISTINCTIONS_AUTHOR]
GO
ALTER TABLE [dbo].[AUTHOR_LANGUAGES]  WITH CHECK ADD  CONSTRAINT [FK_AUTHOR_LANGUAGES_AUTHOR] FOREIGN KEY([author_uuid])
REFERENCES [dbo].[AUTHOR] ([author_uuid])
GO
ALTER TABLE [dbo].[AUTHOR_LANGUAGES] CHECK CONSTRAINT [FK_AUTHOR_LANGUAGES_AUTHOR]
GO
ALTER TABLE [dbo].[AUTHOR_LANGUAGES]  WITH CHECK ADD  CONSTRAINT [FK_AUTHOR_LANGUAGES_LANGUAGE] FOREIGN KEY([language_uuid])
REFERENCES [dbo].[LANGUAGES] ([language_uuid])
GO
ALTER TABLE [dbo].[AUTHOR_LANGUAGES] CHECK CONSTRAINT [FK_AUTHOR_LANGUAGES_LANGUAGE]
GO
ALTER TABLE [dbo].[BANNED_WORDS]  WITH CHECK ADD  CONSTRAINT [FK_BANNED_WORDS_LANGUAGE] FOREIGN KEY([language_uuid])
REFERENCES [dbo].[LANGUAGES] ([language_uuid])
GO
ALTER TABLE [dbo].[BANNED_WORDS] CHECK CONSTRAINT [FK_BANNED_WORDS_LANGUAGE]
GO
ALTER TABLE [dbo].[BOOK]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_SERIES] FOREIGN KEY([book_series_uuid])
REFERENCES [dbo].[SERIES] ([series_uuid])
GO
ALTER TABLE [dbo].[BOOK] CHECK CONSTRAINT [FK_BOOK_SERIES]
GO
ALTER TABLE [dbo].[BOOK_AUTHORS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_AUTHORS_AUTHOR] FOREIGN KEY([author_uuid])
REFERENCES [dbo].[AUTHOR] ([author_uuid])
GO
ALTER TABLE [dbo].[BOOK_AUTHORS] CHECK CONSTRAINT [FK_BOOK_AUTHORS_AUTHOR]
GO
ALTER TABLE [dbo].[BOOK_AUTHORS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_AUTHORS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_AUTHORS] CHECK CONSTRAINT [FK_BOOK_AUTHORS_BOOK]
GO
ALTER TABLE [dbo].[BOOK_CATEGORIES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_CATEGORIES_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_CATEGORIES] CHECK CONSTRAINT [FK_BOOK_CATEGORIES_BOOK]
GO
ALTER TABLE [dbo].[BOOK_CATEGORIES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_CATEGORIES_CATEGORY] FOREIGN KEY([category_uuid])
REFERENCES [dbo].[CATEGORIES] ([category_uuid])
GO
ALTER TABLE [dbo].[BOOK_CATEGORIES] CHECK CONSTRAINT [FK_BOOK_CATEGORIES_CATEGORY]
GO
ALTER TABLE [dbo].[BOOK_IMAGES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_IMAGES_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_IMAGES] CHECK CONSTRAINT [FK_BOOK_IMAGES_BOOK]
GO
ALTER TABLE [dbo].[BOOK_IMAGES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_IMAGES_TYPE] FOREIGN KEY([image_type_uuid])
REFERENCES [dbo].[BOOK_IMAGE_TYPE] ([image_type_uuid])
GO
ALTER TABLE [dbo].[BOOK_IMAGES] CHECK CONSTRAINT [FK_BOOK_IMAGES_TYPE]
GO
ALTER TABLE [dbo].[BOOK_LANGUAGES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_LANGUAGES_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_LANGUAGES] CHECK CONSTRAINT [FK_BOOK_LANGUAGES_BOOK]
GO
ALTER TABLE [dbo].[BOOK_LANGUAGES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_LANGUAGES_LANGUAGE] FOREIGN KEY([language_uuid])
REFERENCES [dbo].[LANGUAGES] ([language_uuid])
GO
ALTER TABLE [dbo].[BOOK_LANGUAGES] CHECK CONSTRAINT [FK_BOOK_LANGUAGES_LANGUAGE]
GO
ALTER TABLE [dbo].[BOOK_NOTES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_NOTES_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_NOTES] CHECK CONSTRAINT [FK_BOOK_NOTES_BOOK]
GO
ALTER TABLE [dbo].[BOOK_NOTES]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_NOTES_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[BOOK_NOTES] CHECK CONSTRAINT [FK_BOOK_NOTES_USER]
GO
ALTER TABLE [dbo].[BOOK_PUBLISHERS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_PUBLISHERS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_PUBLISHERS] CHECK CONSTRAINT [FK_BOOK_PUBLISHERS_BOOK]
GO
ALTER TABLE [dbo].[BOOK_PUBLISHERS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_PUBLISHERS_PUBLISHER] FOREIGN KEY([publisher_uuid])
REFERENCES [dbo].[PUBLISHER] ([publisher_uuid])
GO
ALTER TABLE [dbo].[BOOK_PUBLISHERS] CHECK CONSTRAINT [FK_BOOK_PUBLISHERS_PUBLISHER]
GO
ALTER TABLE [dbo].[BOOK_SERIES_ORDER]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_SERIES_ORDER_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_SERIES_ORDER] CHECK CONSTRAINT [FK_BOOK_SERIES_ORDER_BOOK]
GO
ALTER TABLE [dbo].[BOOK_SERIES_ORDER]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_SERIES_ORDER_SERIES] FOREIGN KEY([series_uuid])
REFERENCES [dbo].[SERIES] ([series_uuid])
GO
ALTER TABLE [dbo].[BOOK_SERIES_ORDER] CHECK CONSTRAINT [FK_BOOK_SERIES_ORDER_SERIES]
GO
ALTER TABLE [dbo].[BOOK_TAGS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_TAGS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_TAGS] CHECK CONSTRAINT [FK_BOOK_TAGS_BOOK]
GO
ALTER TABLE [dbo].[BOOK_TAGS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_TAGS_TAG] FOREIGN KEY([tag_uuid])
REFERENCES [dbo].[TAGS] ([tag_uuid])
GO
ALTER TABLE [dbo].[BOOK_TAGS] CHECK CONSTRAINT [FK_BOOK_TAGS_TAG]
GO
ALTER TABLE [dbo].[BOOK_TRANSLATIONS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_TRANSLATIONS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_TRANSLATIONS] CHECK CONSTRAINT [FK_BOOK_TRANSLATIONS_BOOK]
GO
ALTER TABLE [dbo].[BOOK_TRANSLATIONS]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_TRANSLATIONS_LANGUAGE] FOREIGN KEY([language_uuid])
REFERENCES [dbo].[LANGUAGES] ([language_uuid])
GO
ALTER TABLE [dbo].[BOOK_TRANSLATIONS] CHECK CONSTRAINT [FK_BOOK_TRANSLATIONS_LANGUAGE]
GO
ALTER TABLE [dbo].[BOOK_VERSION_HISTORY]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_VERSION_HISTORY_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[BOOK_VERSION_HISTORY] CHECK CONSTRAINT [FK_BOOK_VERSION_HISTORY_BOOK]
GO
ALTER TABLE [dbo].[BOOK_VERSION_HISTORY]  WITH CHECK ADD  CONSTRAINT [FK_BOOK_VERSION_HISTORY_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[BOOK_VERSION_HISTORY] CHECK CONSTRAINT [FK_BOOK_VERSION_HISTORY_USER]
GO
ALTER TABLE [dbo].[NOTIFICATIONS]  WITH CHECK ADD  CONSTRAINT [FK_NOTIFICATIONS_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[NOTIFICATIONS] CHECK CONSTRAINT [FK_NOTIFICATIONS_USER]
GO
ALTER TABLE [dbo].[ORDER_HISTORY]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_HISTORY_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[ORDER_HISTORY] CHECK CONSTRAINT [FK_ORDER_HISTORY_USER]
GO
ALTER TABLE [dbo].[ORDER_ITEMS]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_ITEMS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[ORDER_ITEMS] CHECK CONSTRAINT [FK_ORDER_ITEMS_BOOK]
GO
ALTER TABLE [dbo].[ORDER_ITEMS]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_ITEMS_ORDER] FOREIGN KEY([order_uuid])
REFERENCES [dbo].[ORDER_HISTORY] ([order_uuid])
GO
ALTER TABLE [dbo].[ORDER_ITEMS] CHECK CONSTRAINT [FK_ORDER_ITEMS_ORDER]
GO
ALTER TABLE [dbo].[PREFERENCES]  WITH CHECK ADD  CONSTRAINT [FK_PREFERENCES_COLOR] FOREIGN KEY([color_uuid])
REFERENCES [dbo].[COLORS] ([color_uuid])
GO
ALTER TABLE [dbo].[PREFERENCES] CHECK CONSTRAINT [FK_PREFERENCES_COLOR]
GO
ALTER TABLE [dbo].[PREFERENCES]  WITH CHECK ADD  CONSTRAINT [FK_PREFERENCES_LANGUAGE] FOREIGN KEY([language_uuid])
REFERENCES [dbo].[LANGUAGES] ([language_uuid])
GO
ALTER TABLE [dbo].[PREFERENCES] CHECK CONSTRAINT [FK_PREFERENCES_LANGUAGE]
GO
ALTER TABLE [dbo].[PREFERENCES]  WITH CHECK ADD  CONSTRAINT [FK_PREFERENCES_THEME] FOREIGN KEY([theme_uuid])
REFERENCES [dbo].[THEMES] ([theme_uuid])
GO
ALTER TABLE [dbo].[PREFERENCES] CHECK CONSTRAINT [FK_PREFERENCES_THEME]
GO
ALTER TABLE [dbo].[PREFERENCES]  WITH CHECK ADD  CONSTRAINT [FK_PREFERENCES_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[PREFERENCES] CHECK CONSTRAINT [FK_PREFERENCES_USER]
GO
ALTER TABLE [dbo].[READ_LIST_BOOKS]  WITH CHECK ADD  CONSTRAINT [FK_READ_LIST_BOOKS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[READ_LIST_BOOKS] CHECK CONSTRAINT [FK_READ_LIST_BOOKS_BOOK]
GO
ALTER TABLE [dbo].[READ_LIST_BOOKS]  WITH CHECK ADD  CONSTRAINT [FK_READ_LIST_BOOKS_READ_LIST] FOREIGN KEY([readList_uuid])
REFERENCES [dbo].[READ_LISTS] ([readList_uuid])
GO
ALTER TABLE [dbo].[READ_LIST_BOOKS] CHECK CONSTRAINT [FK_READ_LIST_BOOKS_READ_LIST]
GO
ALTER TABLE [dbo].[READ_LISTS]  WITH CHECK ADD  CONSTRAINT [FK_READ_LISTS_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[READ_LISTS] CHECK CONSTRAINT [FK_READ_LISTS_USER]
GO
ALTER TABLE [dbo].[SHOPPING_BASKET_ITEMS]  WITH CHECK ADD  CONSTRAINT [FK_SHOPPING_BASKET_ITEMS_BASKET] FOREIGN KEY([basket_uuid])
REFERENCES [dbo].[SHOPPING_BASKETS] ([basket_uuid])
GO
ALTER TABLE [dbo].[SHOPPING_BASKET_ITEMS] CHECK CONSTRAINT [FK_SHOPPING_BASKET_ITEMS_BASKET]
GO
ALTER TABLE [dbo].[SHOPPING_BASKET_ITEMS]  WITH CHECK ADD  CONSTRAINT [FK_SHOPPING_BASKET_ITEMS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[SHOPPING_BASKET_ITEMS] CHECK CONSTRAINT [FK_SHOPPING_BASKET_ITEMS_BOOK]
GO
ALTER TABLE [dbo].[SHOPPING_BASKETS]  WITH CHECK ADD  CONSTRAINT [FK_SHOPPING_BASKETS_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[SHOPPING_BASKETS] CHECK CONSTRAINT [FK_SHOPPING_BASKETS_USER]
GO
ALTER TABLE [dbo].[USER_BOOK_ACTIVITY]  WITH CHECK ADD  CONSTRAINT [FK_USER_BOOK_ACTIVITY_ACTIVITY_TYPE] FOREIGN KEY([activity_type_uuid])
REFERENCES [dbo].[ACTIVITY_TYPES] ([activity_type_uuid])
GO
ALTER TABLE [dbo].[USER_BOOK_ACTIVITY] CHECK CONSTRAINT [FK_USER_BOOK_ACTIVITY_ACTIVITY_TYPE]
GO
ALTER TABLE [dbo].[USER_BOOK_ACTIVITY]  WITH CHECK ADD  CONSTRAINT [FK_USER_BOOK_ACTIVITY_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[USER_BOOK_ACTIVITY] CHECK CONSTRAINT [FK_USER_BOOK_ACTIVITY_BOOK]
GO
ALTER TABLE [dbo].[USER_BOOK_ACTIVITY]  WITH CHECK ADD  CONSTRAINT [FK_USER_BOOK_ACTIVITY_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[USER_BOOK_ACTIVITY] CHECK CONSTRAINT [FK_USER_BOOK_ACTIVITY_USER]
GO
ALTER TABLE [dbo].[USER_BOOK_STATE]  WITH CHECK ADD  CONSTRAINT [FK_USER_BOOK_STATE_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[USER_BOOK_STATE] CHECK CONSTRAINT [FK_USER_BOOK_STATE_BOOK]
GO
ALTER TABLE [dbo].[USER_BOOK_STATE]  WITH CHECK ADD  CONSTRAINT [FK_USER_BOOK_STATE_STATE_STATUS] FOREIGN KEY([state_status_uuid])
REFERENCES [dbo].[STATE_STATUS] ([state_status_uuid])
GO
ALTER TABLE [dbo].[USER_BOOK_STATE] CHECK CONSTRAINT [FK_USER_BOOK_STATE_STATE_STATUS]
GO
ALTER TABLE [dbo].[USER_BOOK_STATE]  WITH CHECK ADD  CONSTRAINT [FK_USER_BOOK_STATE_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[USER_BOOK_STATE] CHECK CONSTRAINT [FK_USER_BOOK_STATE_USER]
GO
ALTER TABLE [dbo].[USER_CONNECTIONS]  WITH CHECK ADD  CONSTRAINT [FK_USER_CONNECTIONS] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[USER_CONNECTIONS] CHECK CONSTRAINT [FK_USER_CONNECTIONS]
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY]  WITH CHECK ADD  CONSTRAINT [FK_USER_ROLE_HISTORY_USER_MODIFIED_BY] FOREIGN KEY([modified_by_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY] CHECK CONSTRAINT [FK_USER_ROLE_HISTORY_USER_MODIFIED_BY]
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY]  WITH CHECK ADD  CONSTRAINT [FK_USER_ROLE_HISTORY_USER_RIGHT_NEW] FOREIGN KEY([new_right_uuid])
REFERENCES [dbo].[USER_RIGHTS] ([user_right_uuid])
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY] CHECK CONSTRAINT [FK_USER_ROLE_HISTORY_USER_RIGHT_NEW]
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY]  WITH CHECK ADD  CONSTRAINT [FK_USER_ROLE_HISTORY_USER_RIGHT_PREVIOUS] FOREIGN KEY([previous_right_uuid])
REFERENCES [dbo].[USER_RIGHTS] ([user_right_uuid])
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY] CHECK CONSTRAINT [FK_USER_ROLE_HISTORY_USER_RIGHT_PREVIOUS]
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY]  WITH CHECK ADD  CONSTRAINT [FK_USER_ROLE_HISTORY_USER_TARGET] FOREIGN KEY([target_user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY] CHECK CONSTRAINT [FK_USER_ROLE_HISTORY_USER_TARGET]
GO
ALTER TABLE [dbo].[USERS]  WITH CHECK ADD  CONSTRAINT [FK_GENDERS] FOREIGN KEY([gender_uuid])
REFERENCES [dbo].[GENDERS] ([gender_uuid])
GO
ALTER TABLE [dbo].[USERS] CHECK CONSTRAINT [FK_GENDERS]
GO
ALTER TABLE [dbo].[USERS]  WITH CHECK ADD  CONSTRAINT [FK_USER_RIGHTS] FOREIGN KEY([user_right_uuid])
REFERENCES [dbo].[USER_RIGHTS] ([user_right_uuid])
GO
ALTER TABLE [dbo].[USERS] CHECK CONSTRAINT [FK_USER_RIGHTS]
GO
ALTER TABLE [dbo].[WISHLIST_BOOKS]  WITH CHECK ADD  CONSTRAINT [FK_WISHLIST_BOOKS_BOOK] FOREIGN KEY([book_uuid])
REFERENCES [dbo].[BOOK] ([book_uuid])
GO
ALTER TABLE [dbo].[WISHLIST_BOOKS] CHECK CONSTRAINT [FK_WISHLIST_BOOKS_BOOK]
GO
ALTER TABLE [dbo].[WISHLIST_BOOKS]  WITH CHECK ADD  CONSTRAINT [FK_WISHLIST_BOOKS_USER] FOREIGN KEY([user_uuid])
REFERENCES [dbo].[USERS] ([user_uuid])
GO
ALTER TABLE [dbo].[WISHLIST_BOOKS] CHECK CONSTRAINT [FK_WISHLIST_BOOKS_USER]
GO
ALTER TABLE [dbo].[AUDIT_TRAIL]  WITH CHECK ADD CHECK  (([action_type]='DELETE' OR [action_type]='UPDATE' OR [action_type]='CREATE'))
GO
ALTER TABLE [dbo].[BOOK_NOTES]  WITH CHECK ADD CHECK  (([note_value]>=(0) AND [note_value]<=(5)))
GO
ALTER TABLE [dbo].[BOOK_SERIES_ORDER]  WITH CHECK ADD CHECK  (([series_order]>(0)))
GO
ALTER TABLE [dbo].[ORDER_HISTORY]  WITH CHECK ADD CHECK  (([total_amount]>=(0)))
GO
ALTER TABLE [dbo].[ORDER_ITEMS]  WITH CHECK ADD CHECK  (([unit_price]>=(0)))
GO
ALTER TABLE [dbo].[SHOPPING_BASKET_ITEMS]  WITH CHECK ADD CHECK  (([quantity]>(0)))
GO
ALTER TABLE [dbo].[SHOPPING_BASKET_ITEMS]  WITH CHECK ADD CHECK  (([unit_price]>=(0)))
GO
ALTER TABLE [dbo].[USER_ROLE_HISTORY]  WITH CHECK ADD CHECK  (([previous_right_uuid]<>[new_right_uuid]))
GO